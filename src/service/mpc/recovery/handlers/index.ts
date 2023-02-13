import {wrapMessage} from '@/service/mpc/flow/MessageFilter';
import {MPCMessage, OperationType, PartyWithZkp} from '@/service/mpc/algorithm/Model';
import {MPCHelp} from '@/service/mpc/algorithm/MPCAlgorithm';
import {AggregateKeyShardResult} from '@safeheron/mpc-wasm-sdk';
import {computeAddress} from 'ethers/lib/utils';
import {genWalletId, getPartyIndex, PartyId} from '@/service/mpc/util';
import {
  MnemonicReadyMessage,
  MnemonicSkipMessage,
  PartySecretKeyReadyMessage,
  RecoverPrepareMessage,
  RecoverRoundMessage,
  RecoverSuccessMessage,
  RefreshReadyMessage,
  RefreshRoundMessage,
  RefreshSuccessMessage,
  RelayMessage,
  RoleReadyMessage,
} from '@safeheron/mpcsnap-types';
import Store from '@/service/store/Store';
import {DISABLE_SKIP_EVENT, KeyRecoveryFlow} from '@/service/mpc/recovery/KeyRecoveryFlow';
import logger from '@/service/logger/logger';

async function recoverPrepare(flow: KeyRecoveryFlow, messages: RecoverPrepareMessage[], result: MPCMessage[]) {
  const messageContent = messages[0].messageContent;

  const {index, sessionId} = messageContent;

  flow.sessionId = sessionId;
  flow.joinOrderIndex = index;

  await flow.keyRecovery.setupLocalCpkp();
  flow.localCommuPrivKey = flow.keyRecovery.localCommunicationPriv;

  const roleReadyMessageContent: RoleReadyMessage['messageContent'] = {
    index: index,
    pub: flow.keyRecovery.localCommunicationPub,
    hasKeyShare: flow.localKeyshareExist,
    walletId: flow.ownWalletId,
    partyId: flow.ownPartyId,
    walletName: flow.walletName,
  };

  wrapMessage(result, OperationType.roleReady, roleReadyMessageContent);

  // If this device is the first connected device, need navigate to prepare screen
  // and wait another device to connect.
  if (index === 2) {
    flow.emitPrepare({event: 'RecoverReady'});
  }
}

async function roleReady(flow: KeyRecoveryFlow, messages: RoleReadyMessage[], _: MPCMessage[]) {
  const otherPartiesBothHaveKeyshare = messages.every(v => v.messageContent.hasKeyShare);

  //  All three parties have private key shards, no need to restore them
  if (otherPartiesBothHaveKeyshare && flow.localKeyshareExist) {
    flow.emitPrepare({event: 'RecoveryNotNeed'});
    return;
  }

  /**
   * Confirm remote party communication pub, there are 3 enumerable states
   *
   *  -- [{index: 1, partyId: A}, {index: ?, partyId: B}]
   *  -- [{index: 1, partyId: A}, {index: ?, partyId: C}]
   *  -- [{index: 1, partyId: A}, {index: ?, partyId: undefined}]
   *
   */
  const anotherAppParty = messages.find(m => m.messageContent.index !== 1);
  if (!anotherAppParty) {
    throw new Error('Invalid data: ' + JSON.stringify(messages));
  }

  const anotherAppPartyId = anotherAppParty.messageContent.partyId;
  if (flow.ownPartyId && flow.ownPartyId === anotherAppPartyId) {
    throw new Error('Invalid data: ' + JSON.stringify(messages));
  }

  if (!flow.ownPartyId) {
    if (anotherAppPartyId) {
      flow.ownPartyId = anotherAppPartyId === 'C' ? 'B' : 'C';
    } else {
      flow.ownPartyId = flow.joinOrderIndex === 2 ? 'B' : 'C';
    }
  }

  const realAnotherPartyId = flow.ownPartyId === 'B' ? 'C' : 'B';

  flow.remotePubKeys = messages.map(m => {
    return {
      partyId: m.messageContent.index === 1 ? 'A' : realAnotherPartyId,
      pubKey: m.messageContent.pub,
    };
  });

  /**
   * If local keyshare exist, go to DisplayMnemonic screen
   * Else go to MnemonicInput screen
   */
  if (flow.localKeyshareExist) {
    const ownSignKey = Store.get().originalSignKey;

    const extractMnemonic = await MPCHelp.getMnemonicFromSignKey(ownSignKey!);
    const mnemonic = extractMnemonic.mnemo;
    if (mnemonic) {
      flow.localOriginMnemonic = mnemonic;
      flow.emitPrepare({event: 'DisplayMnemonic', data: extractMnemonic.mnemo});
    } else {
      throw 'Cannot extract mnemonic from local exist signKey.';
    }
  } else {
    flow.emitPrepare({event: 'MnemonicInput', data: flow.ownPartyId});
  }
}

async function mnemonicSkip(flow: KeyRecoveryFlow, _: MnemonicSkipMessage[], __: MPCMessage[]) {
  flow.emit(DISABLE_SKIP_EVENT);
}

async function mnemonicReady(
  flow: KeyRecoveryFlow,
  messages: MnemonicReadyMessage[],
  result: MPCMessage[],
): Promise<void> {
  if (!flow.localKeyshareExist) {
    flow.walletName = messages.find(v => Boolean(v.messageContent.walletName))?.messageContent.walletName;
  }

  // Three parties both have mnemonic, go to refresh process
  if (messages.every(v => v.messageContent?.hasMnemonic === true) && flow.hasMnemonic) {
    wrapMessage(result, OperationType.recoverSuccess, null);
    return;
  }

  // If this party don’t have a mnemonic phrase, self is recovered party and
  // just need to wait to receive the partySecretKey message.
  if (!flow.hasMnemonic) {
    /* DO NOTHING, just wait recover data from other two parties */
    return;
  }

  // If this party have keyshare or mnemonic phrase, determine the remote-recover-party
  // and remote-lost-party, then do MPC Recover compute
  if (flow.hasMnemonic) {
    // The remote-recover-party
    const remote = messages.find(v => v.messageContent.hasMnemonic);
    flow.remotePartyId = remote?.messageContent.partyId as PartyId;
    flow.remoteDeviceId = remote?.from;

    // The remote-lost-party
    const lost = messages.find(v => !v.messageContent.hasMnemonic);
    flow.lostPartyId = lost?.messageContent.partyId as PartyId;
    flow.lostDeviceId = lost?.from;

    const recoverContextParams = {
      localMnemonic: flow.mnemonic!,
      localParty: {
        partyId: flow.ownPartyId!,
        index: getPartyIndex(flow.ownPartyId!),
      },
      remoteParty: {
        partyId: flow.remotePartyId!,
        index: getPartyIndex(flow.remotePartyId!),
        pub: flow.getPubkeyByPartyId(flow.remotePartyId)!,
      },
      lostParty: {
        partyId: flow.lostPartyId!,
        index: getPartyIndex(flow.lostPartyId!),
        pub: flow.getPubkeyByPartyId(flow.lostPartyId)!,
      },
    };

    // Run MPC recoverContext
    const res = await flow.keyRecovery.createContext(recoverContextParams);

    wrapMessage(result, OperationType.recoverRound, res, {
      to: flow.remoteDeviceId,
    });
  }
}

async function recoverRound(flow: KeyRecoveryFlow, messages: RecoverRoundMessage[], result: MPCMessage[]) {
  const roundRes = await flow.keyRecovery.runRound(messages[0].messageContent);
  if (flow.keyRecovery.isComplete) {
    const partySecretKey = await flow.keyRecovery.getEncryptedPartySecretKey();

    const data = {
      partyId: flow.ownPartyId,
      partySecretKey,
      pubKeyOfThreeParty: flow.keyRecovery.pubKeyOfThreeParty,
    };
    wrapMessage(result, OperationType.partySecretKeyReady, data, {
      to: flow.lostDeviceId,
      sendType: 'p2p',
    });
    wrapMessage(result, OperationType.recoverSuccess, null);
  } else {
    wrapMessage(result, OperationType.recoverRound, roundRes, {
      to: flow.remoteDeviceId,
    });
  }
}

// Only the recovered party will receive this message
async function partySecretKeyReady(
  flow: KeyRecoveryFlow,
  messages: PartySecretKeyReadyMessage[],
  result: MPCMessage[],
) {
  const content = messages[0].messageContent;
  const find = flow.partySecretKeys.find(_ => content.partyId);

  if (!find || find.secretKey !== content.partySecretKey) {
    flow.partySecretKeys.push({
      partyId: content.partyId as PartyId,
      secretKey: content.partySecretKey,
    });
  }

  if (flow.partySecretKeys.length === 2) {
    const pubKeyOfThreeParty = (messages[0] as PartySecretKeyReadyMessage).messageContent.pubKeyOfThreeParty;

    const decryptedSecretKeys: string[] = [];
    for await (const encryptedPartySecretKey of flow.partySecretKeys) {
      const targetPartyId = encryptedPartySecretKey.partyId;
      const remotePubKey = flow.remotePubKeys.find(v => v.partyId === targetPartyId)?.pubKey!;
      const decrypted = await MPCHelp.decrypt(flow.localCommuPrivKey!, remotePubKey, encryptedPartySecretKey.secretKey);
      decryptedSecretKeys.push(decrypted.plain);
    }

    const aksResult: AggregateKeyShardResult = await MPCHelp.generateMnemonic(decryptedSecretKeys, pubKeyOfThreeParty);
    flow.aggregatedMnemonic = aksResult.mnemo;
    wrapMessage(result, OperationType.recoverSuccess, null);
  }
}

async function recoverSuccess(flow: KeyRecoveryFlow, _: RecoverSuccessMessage[], result: MPCMessage[]) {
  const pubAndZkp = await flow.keyRefresh.generatePubAndZkp(flow.mnemonic!);
  wrapMessage(result, OperationType.refreshReady, {
    ...pubAndZkp,
    partyId: flow.ownPartyId,
  });
}

async function refreshReady(flow: KeyRecoveryFlow, messages: RefreshReadyMessage[], result: MPCMessage[]) {
  const remoteParties: PartyWithZkp[] = messages.map(v => ({
    party_id: v.messageContent.partyId,
    index: getPartyIndex(v.messageContent.partyId as PartyId),
    X: v.messageContent.X,
    dlog_zkp: v.messageContent.dlog_zkp,
  }));

  flow.keyRefresh.setupLocalCpkp({
    priv: flow.keyRecovery.localCommunicationPriv,
    pub: flow.keyRecovery.localCommunicationPub,
  });

  await flow.keyRefresh.generateMinimalKey(
    {
      party_id: flow.ownPartyId!,
      index: getPartyIndex(flow.ownPartyId!),
    },
    remoteParties,
    flow.remotePubKeys.map(rp => ({partyId: rp.partyId, pub: rp.pubKey})),
  );

  const contextResult = await flow.keyRefresh.createContext();

  wrapMessage(result, OperationType.refreshRound, contextResult);
}

async function refreshRound(flow: KeyRecoveryFlow, messages: RefreshRoundMessage[], result: MPCMessage[]) {
  const remoteMessageList = messages.map(
    v => v.messageContent.find((msg: any) => msg.destination === flow.ownPartyId)!,
  );
  const roundResult = await flow.keyRefresh.runRound(remoteMessageList);
  if (flow.keyRefresh.isComplete) {
    // Validate address in case user enter a couple of wrong mnemonic phrase then recover a different wallet
    const address = computeAddress(`0x${flow.keyRefresh.getPub()}`);
    if (flow.localKeyshareExist && address !== flow.originAddress) {
      throw new Error(
        'Recover failed. Recovered address does not match the old address in the keyshare, ' +
          'please make sure you enter the mnemonic phrase according to the role prompted, and make sure every word is correct.',
      );
    }

    wrapMessage(result, OperationType.refreshSuccess, '');
  } else {
    wrapMessage(result, OperationType.refreshRound, roundResult);
  }
}

async function refreshSuccess(flow: KeyRecoveryFlow, _: RefreshSuccessMessage[], __: MPCMessage[]) {
  const signKey = flow.keyRefresh.getSignKey();
  const address = computeAddress(`0x${flow.keyRefresh.getPub()}`);

  await Store.get().createWallet({
    id: genWalletId(flow.sessionId, address),
    name: flow.walletName!!,
    address: address,
    signKey: signKey!,
    partyId: flow.ownPartyId!!,
    isBackup: !flow.needBackup,
  });
}

export type HandlerFunc = (flow: KeyRecoveryFlow, messages: RelayMessage[], result: MPCMessage[]) => Promise<void>;
export type RecoverRelayMessageType =
  | OperationType.mnemonicReady
  | OperationType.mnemonicSkip
  | OperationType.partySecretKeyReady
  | OperationType.recoverPrepare
  | OperationType.recoverRound
  | OperationType.recoverSuccess
  | OperationType.refreshReady
  | OperationType.refreshRound
  | OperationType.refreshSuccess
  | OperationType.roleReady;

const handlers: {[key in RecoverRelayMessageType]: HandlerFunc} = {
  mnemonicReady,
  mnemonicSkip,
  partySecretKeyReady,
  recoverPrepare,
  recoverRound,
  recoverSuccess,
  refreshReady,
  refreshRound,
  refreshSuccess,
  roleReady,
};

export {handlers};
