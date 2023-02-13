export type WorkFlowEvent = 'prepare' | 'progress' | 'success' | 'fail';
export type WorkFlowPrepareEvent =
  | 'CreateWallet'
  | 'Sign'
  | 'RecoveryNotNeed'
  | 'RecoverReady'
  | 'DisplayMnemonic'
  | 'MnemonicInput';

export const WORKFLOW_EVENT_PREPARE = 'prepare';
export const WORKFLOW_EVENT_PROGRESS = 'progress';
export const WORKFLOW_EVENT_SUCCESS = 'success';
export const WORKFLOW_EVENT_FAIL = 'fail';
export const WORKFLOW_EVENT_CANCEL = 'cancel';

export const PREPARE_SUB_EVENT_CREATE_WALLET = 'CreateWallet';
export const PREPARE_SUB_EVENT_SIGN = 'Sign';
export const PREPARE_SUB_EVENT_RECOVERY_NOT_NEED = 'RecoveryNotNeed';
export const PREPARE_SUB_EVENT_RECOVER_READY = 'RecoverReady';
export const PREPARE_SUB_EVENT_DISPLAY_MNEMONIC = 'DisplayMnemonic';
export const PREPARE_SUB_EVENT_MNEMONIC_INPUT = 'MnemonicInput';
