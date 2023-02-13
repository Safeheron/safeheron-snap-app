import {UR, UREncoder} from '@ngraveio/bc-ur';
import {Buffer} from 'buffer';
import React, {useEffect, useRef, useState} from 'react';
import QRCode from 'react-native-qrcode-svg';
import pako from 'pako';

interface Props {
  value: string;
  size: number;
  needSplit?: boolean;
}
const DynamicQRCode: React.FC<Props> = props => {
  const {value, size, needSplit = true} = props;

  const [code, setCode] = useState<string | null>(null);

  const timer = useRef<any>();

  const generateQrCode = () => {
    if (!value) {
      return;
    }
    const compressedValue = pako.deflate(value);
    const messageBuffer = Buffer.from(compressedValue);
    const ur = UR.fromBuffer(messageBuffer);
    const fragmentsLen = Math.ceil(messageBuffer.length / 10) + 1;
    const maxFragmentLength = fragmentsLen > 300 ? 300 : fragmentsLen;
    const minFragmentLength = 1;
    const encoder = new UREncoder(ur, maxFragmentLength, 0, minFragmentLength);

    clearInterval(timer.current);
    timer.current = setInterval(() => {
      const part = encoder.nextPart();
      if (part) {
        setCode(part);
      }
    }, 300);
  };
  useEffect(() => {
    if (needSplit) {
      generateQrCode();
    } else {
      setCode(value);
    }
    return () => clearInterval(timer.current);
  }, []);

  return code ? <QRCode size={size} value={code} /> : <></>;
};

export default DynamicQRCode;
