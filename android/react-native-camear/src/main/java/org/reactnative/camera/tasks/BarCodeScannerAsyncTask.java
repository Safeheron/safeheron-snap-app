package org.reactnative.camera.tasks;

import android.text.TextUtils;
import android.util.Log;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.PlanarYUVLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.GlobalHistogramBinarizer;
import com.google.zxing.common.HybridBinarizer;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

public class BarCodeScannerAsyncTask extends android.os.AsyncTask<Void, Void, Result> {
  private byte[] mImageData;
  private int mWidth;
  private int mHeight;
  private BarCodeScannerAsyncTaskDelegate mDelegate;
  private final MultiFormatReader mMultiFormatReader;
  private boolean mLimitScanArea;
  private float mScanAreaX;
  private float mScanAreaY;
  private float mScanAreaWidth;
  private float mScanAreaHeight;
  private int mCameraViewWidth;
  private int mCameraViewHeight;
  private float mRatio;

  static final Map<DecodeHintType, Object> HIGH_FREQUENCY_HINT_MAP = new EnumMap<>(DecodeHintType.class);

  static {
    List<BarcodeFormat> highFrequencyFormatList = new ArrayList<>();
    highFrequencyFormatList.add(BarcodeFormat.QR_CODE);
    highFrequencyFormatList.add(BarcodeFormat.UPC_A);
    highFrequencyFormatList.add(BarcodeFormat.EAN_13);
    highFrequencyFormatList.add(BarcodeFormat.CODE_128);
    HIGH_FREQUENCY_HINT_MAP.put(DecodeHintType.POSSIBLE_FORMATS, highFrequencyFormatList);
    HIGH_FREQUENCY_HINT_MAP.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);
    HIGH_FREQUENCY_HINT_MAP.put(DecodeHintType.CHARACTER_SET, "utf-8");
  }

  //  note(sjchmiela): From my short research it's ok to ignore rotation of the image.
  public BarCodeScannerAsyncTask(BarCodeScannerAsyncTaskDelegate delegate,
      MultiFormatReader multiFormatReader, byte[] imageData, int width, int height,
      boolean limitScanArea, float scanAreaX, float scanAreaY, float scanAreaWidth,
      float scanAreaHeight, int cameraViewWidth, int cameraViewHeight, float ratio) {
    mImageData = imageData;
    mWidth = width;
    mHeight = height;
    mDelegate = delegate;
    mMultiFormatReader = multiFormatReader;
    mLimitScanArea = limitScanArea;
    mScanAreaX = scanAreaX;
    mScanAreaY = scanAreaY;
    mScanAreaWidth = scanAreaWidth;
    mScanAreaHeight = scanAreaHeight;
    mCameraViewWidth = cameraViewWidth;
    mCameraViewHeight = cameraViewHeight;
    mRatio = ratio;
  }

  @Override protected Result doInBackground(Void... ignored) {
    if (isCancelled() || mDelegate == null) {
      return null;
    }

    /**
     * mCameraViewWidth and mCameraViewHeight are obtained from portait orientation
     * mWidth and mHeight are measured with landscape orientation with Home button to the right
     * adjustedCamViewWidth is the adjusted width from the Aspect ratio setting
     */
    int adjustedCamViewWidth = (int) (mCameraViewHeight / mRatio);
    float adjustedScanY =
        (((adjustedCamViewWidth - mCameraViewWidth) / 2) + (mScanAreaY * mCameraViewWidth))
            / adjustedCamViewWidth;

    int left = (int) (mScanAreaX * mWidth);
    int top = (int) (adjustedScanY * mHeight);
    int scanWidth = (int) (mScanAreaWidth * mWidth);
    int scanHeight =
        (int) (((mScanAreaHeight * mCameraViewWidth) / adjustedCamViewWidth) * mHeight);

    try {
      try {
        mMultiFormatReader.setHints(HIGH_FREQUENCY_HINT_MAP);
        return processData(mImageData, mWidth, mHeight);
      } catch (Exception e) {}
      try {
        BinaryBitmap bitmap =
            generateBitmapFromImageData(mImageData, mWidth, mHeight, false, left, top, scanWidth,
                scanHeight);
        return mMultiFormatReader.decodeWithState(bitmap);
      } catch (NotFoundException e) {
      }

      try {
        BinaryBitmap bitmap =
            generateBitmapFromImageData(rotateImage(mImageData, mWidth, mHeight), mHeight, mWidth,
                false, mHeight - scanHeight - top, left, scanHeight, scanWidth);
        return mMultiFormatReader.decodeWithState(bitmap);
      } catch (NotFoundException e) {
      }

      try {
        BinaryBitmap invertedBitmap = generateBitmapFromImageData(mImageData, mWidth, mHeight, true,
            mWidth - scanWidth - left, mHeight - scanHeight - top, scanWidth, scanHeight);
        return mMultiFormatReader.decodeWithState(invertedBitmap);
      } catch (NotFoundException e) {
      }

      try {
        BinaryBitmap invertedRotatedBitmap =
            generateBitmapFromImageData(rotateImage(mImageData, mWidth, mHeight), mHeight, mWidth,
                true, top, mWidth - scanWidth - left, scanHeight, scanWidth);
        return mMultiFormatReader.decodeWithState(invertedRotatedBitmap);
      } catch (NotFoundException e) {
      }
    } catch (Throwable t) {
      t.printStackTrace();
    }

    // no barcode found
    return null;
  }

  private Result processData(byte[] data, int width, int height) {
    Result rawResult = null;
    try {
      PlanarYUVLuminanceSource source;
      source = new PlanarYUVLuminanceSource(data, width, height, 0, 0, width, height, false);
      rawResult = mMultiFormatReader.decodeWithState(
          new BinaryBitmap(new GlobalHistogramBinarizer(source)));
      if (rawResult == null) {
        rawResult =
            mMultiFormatReader.decodeWithState(new BinaryBitmap(new HybridBinarizer(source)));
        if (rawResult != null) {
          Log.d("processData", "GlobalHistogramBinarizer 没识别到，HybridBinarizer 能识别到");
        }
      }
    } catch (Exception e) {
      e.printStackTrace();
    } finally {
      mMultiFormatReader.reset();
    }
    if (rawResult == null) {
      return null;
    }

    String result = rawResult.getText();
    if (TextUtils.isEmpty(result)) {
      return null;
    }
    return rawResult;
  }

  private byte[] rotateImage(byte[] imageData, int width, int height) {
    byte[] rotated = new byte[imageData.length];
    for (int y = 0; y < height; y++) {
      for (int x = 0; x < width; x++) {
        rotated[x * height + height - y - 1] = imageData[x + y * width];
      }
    }
    return rotated;
  }

  @Override protected void onPostExecute(Result result) {
    super.onPostExecute(result);
    if (result != null) {
      mDelegate.onBarCodeRead(result, mWidth, mHeight, mImageData);
    }
    mDelegate.onBarCodeScanningTaskCompleted();
  }

  private BinaryBitmap generateBitmapFromImageData(byte[] imageData, int width, int height,
      boolean inverse, int left, int top, int sWidth, int sHeight) {
    PlanarYUVLuminanceSource source;
    if (mLimitScanArea) {
      source = new PlanarYUVLuminanceSource(imageData, // byte[] yuvData
          width, // int dataWidth
          height, // int dataHeight
          left, // int left
          top, // int top
          sWidth, // int width
          sHeight, // int height
          false // boolean reverseHorizontal
      );
    } else {
      source = new PlanarYUVLuminanceSource(imageData, // byte[] yuvData
          width, // int dataWidth
          height, // int dataHeight
          0, // int left
          0, // int top
          width, // int width
          height, // int height
          false // boolean reverseHorizontal
      );
    }
    if (inverse) {
      return new BinaryBitmap(new HybridBinarizer(source.invert()));
    } else {
      return new BinaryBitmap(new HybridBinarizer(source));
    }
  }
}
