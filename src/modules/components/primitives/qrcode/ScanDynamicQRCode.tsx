import {URDecoder} from '@ngraveio/bc-ur';
import React, {FC, useRef, useState} from 'react';
import pako from 'pako';
import {Dimensions, Linking, Platform, StatusBar, StyleSheet} from 'react-native';
import {BarCodeReadEvent, RNCamera} from 'react-native-camera';
import Svg, {Text as SVGText, ClipPath, Defs, Path, Polygon, Rect} from 'react-native-svg';
import {Flex, Button, Text} from '@/modules/components';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {PinchGestureHandler, State, TapGestureHandler} from 'react-native-gesture-handler';
import {HandlerStateChangeEventPayload} from 'react-native-gesture-handler/src/handlers/gestureHandlerCommon';
import {PinchGestureHandlerEventPayload} from 'react-native-gesture-handler/src/handlers/PinchGestureHandler';
import logger from '@/service/logger/logger';

const {width, height} = Dimensions.get('screen');
const rectWidth = 280;
const rectHeight = 280;

const reactX = (width - rectWidth) / 2;
const reactY = Math.ceil((height - rectHeight) / 2) - 30;
const polygonPoints = `${reactX},${reactY} ${reactX},${reactY + rectHeight} ${reactX + rectWidth},${
  reactY + rectHeight
} ${reactX + rectWidth},${reactY}`;
const corner = 'M0 1.5 L20 1.5 M1.5 0 L1.5 20';
const rectOfInterest = {
  x: reactY / height,
  y: reactX / width,
  width: rectHeight / height,
  height: rectWidth / width,
};
interface ScanDynamicQRCodeProps {
  onComplete: (data: any) => void;
  onError: (error: any) => void;
}

const ScanDynamicQRCode: FC<ScanDynamicQRCodeProps> = ({onComplete, onError}) => {
  const [progress, setProgress] = useState(0);
  const isFocused = useIsFocused();
  const [zoomLevel, setZoomLevel] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const decoderRef = useRef<URDecoder>(new URDecoder());
  const cameraRef = useRef<React.ElementRef<typeof RNCamera>>(null);

  const emittedFlag = useRef(false);

  const onBarCodeRead = (event: BarCodeReadEvent) => {
    const percent = decoderRef.current.getProgress();
    if (percent > progress) {
      setProgress(percent);
    }
    const data = event.data;
    try {
      if (!decoderRef.current.isComplete()) {
        if (data) {
          decoderRef.current.receivePart(data);
        }
        return;
      }

      if (decoderRef.current.isSuccess() && !emittedFlag.current) {
        const ur = decoderRef.current.resultUR();
        const decoded = ur.decodeCBOR();

        setProgress(1);
        // @ts-ignore
        const inflateStr = pako.inflate(decoded, {
          to: 'string',
        });
        onComplete(inflateStr);
        emittedFlag.current = true;
      }

      if (decoderRef.current.isError()) {
        const decodedErrors = decoderRef.current.resultError();
        onError(decodedErrors);
      }
    } catch (e) {
      logger.screen.error('Scan Qrcode error: ', e);
      onError('Invalid QR code');
    }
  };

  const navigation = useNavigation();
  const onCancel = () => {
    navigation.goBack();
  };

  const toSetting = async () => {
    await Linking.openSettings();
    onCancel();
  };

  const handleDoubleTap = ({nativeEvent}: {nativeEvent: HandlerStateChangeEventPayload}) => {
    if (nativeEvent.state === State.ACTIVE) {
      const currentTime = new Date().getTime();
      const doubleTapInterval = 300;
      if (currentTime - lastTapTime < doubleTapInterval) {
        setZoomLevel(Math.min(zoomLevel + 0.1, 1));
      }
      setLastTapTime(currentTime);
    }
  };

  const handleGestureZoom = ({nativeEvent}: {nativeEvent: PinchGestureHandlerEventPayload}) => {
    const pinchScale = nativeEvent.scale;
    const scaleMultiplier = 0.01;
    const newZoomLevel = zoomLevel + (pinchScale - 1) * scaleMultiplier;
    const minZoom = 0;
    const clampedZoomLevel = Math.max(minZoom, Math.min(1, newZoomLevel));

    setZoomLevel(clampedZoomLevel);
  };

  if (!isFocused) {
    return null;
  }
  return (
    <Flex flex={1}>
      {Platform.OS === 'ios' && <StatusBar barStyle={'light-content'} />}
      <RNCamera
        rectOfInterest={rectOfInterest}
        style={styles.preview}
        ref={cameraRef}
        maxZoom={2}
        zoom={Platform.OS === 'android' ? zoomLevel : zoomLevel}
        captureAudio={false}
        type={RNCamera.Constants.Type.back}
        barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
        flashMode={RNCamera.Constants.FlashMode.auto}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        notAuthorizedView={
          <Flex style={{flex: 1}} justify={'center'} align={'center'}>
            <Text style={{marginBottom: 20}}>You need to enable camera permission for Safeheron Snap App</Text>
            <Flex row>
              <Button style={{width: 120, marginRight: 20}} onPress={onCancel}>
                Cancel
              </Button>
              <Button style={{width: 120}} onPress={toSetting}>
                Enable
              </Button>
            </Flex>
          </Flex>
        }
        onBarCodeRead={onBarCodeRead}>
        <TapGestureHandler onHandlerStateChange={handleDoubleTap}>
          <PinchGestureHandler onGestureEvent={handleGestureZoom}>
            <Svg height={'100%'} width={'100%'} style={styles.svg}>
              <Defs>
                <ClipPath id="clip">
                  <Rect x="0" y="0" height={height} width={width} />
                  <Polygon points={polygonPoints} />
                </ClipPath>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="#000000" opacity="0.6" clipPath="url(#clip)" />
              <Corner x={reactX} y={reactY} rotation={0} />
              <Corner x={reactX + rectWidth} y={reactY} rotation={90} />
              <Corner x={reactX + rectWidth} y={reactY + rectHeight} rotation={180} />
              <Corner x={reactX} y={reactY + rectHeight} rotation={270} />
              <SVGText x={'20%'} y={'20%'} fill="white" fontSize={16}>
                Scan the QR code of the desktop
              </SVGText>
              {progress > 0 && (
                <SVGText x={'32%'} y={reactY + rectHeight + 50} fill="white" fontSize={16}>
                  Progress: {(progress * 100).toFixed(0)}%
                </SVGText>
              )}
            </Svg>
          </PinchGestureHandler>
        </TapGestureHandler>
      </RNCamera>
    </Flex>
  );
};

interface CornerProps {
  x: number;
  y: number;
  rotation: 0 | 90 | 180 | 270;
}

const Corner: FC<CornerProps> = ({x, y, rotation}) => (
  <Path
    x={x + (rotation == 0 || rotation == 270 ? -3 : 3)}
    y={y + (rotation == 0 || rotation == 90 ? -3 : 3)}
    rotation={rotation}
    d={corner}
    fill="none"
    stroke={'#FFFFFF'}
    strokeWidth="3"
  />
);
const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  preview: {
    width: width,
    height: height,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
  },
  svg: {
    position: 'absolute',
  },
  header: {
    backgroundColor: 'transparent',
  },
  typeButton: {
    padding: 5,
  },
  flashButtonflashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});

export default ScanDynamicQRCode;
