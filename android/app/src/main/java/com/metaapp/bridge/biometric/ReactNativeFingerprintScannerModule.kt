package com.metaapp.bridge.biometric

import android.os.Build.VERSION
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators
import androidx.biometric.BiometricPrompt
import androidx.biometric.BiometricPrompt.PromptInfo.Builder
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.UiThreadUtil
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.wei.android.lib.fingerprintidentify.FingerprintIdentify
import com.wei.android.lib.fingerprintidentify.base.BaseFingerprint.IdentifyListener
import java.util.concurrent.Executor
import java.util.concurrent.Executors

// for Samsung/MeiZu compat, Android v16-23
@ReactModule(name = "ReactNativeFingerprintScanner")
class ReactNativeFingerprintScannerModule(private val mReactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(
    mReactContext
  ), LifecycleEventListener {
  private var biometricPrompt: BiometricPrompt? = null
  private val authCallback: AuthCallback? = AuthCallback()

  // for Samsung/MeiZu compat, Android v16-23
  private var mFingerprintIdentify: FingerprintIdentify? = null
  override fun getName(): String {
    return MODULE
  }

  override fun onHostResume() {}
  override fun onHostPause() {}
  override fun onHostDestroy() {
    release()
  }

  private fun currentAndroidVersion(): Int {
    return VERSION.SDK_INT
  }

  private fun requiresLegacyAuthentication(): Boolean {
    return currentAndroidVersion() < 23
  }

  private var mPromise: Promise? = null
  fun getBiometricPrompt(fragmentActivity: FragmentActivity?): BiometricPrompt {
    // memoize so can be accessed to cancel
    if (biometricPrompt != null) {
      return biometricPrompt!!
    }

    // listen for onHost* methods
    mReactContext.addLifecycleEventListener(this)
    val executor: Executor = Executors.newSingleThreadExecutor()
    biometricPrompt = BiometricPrompt(
      fragmentActivity!!,
      executor,
      authCallback!!
    )
    return biometricPrompt!!
  }

  private fun biometricAuthenticate(
    title: String,
    subtitle: String,
    description: String,
    cancelButton: String
  ) {
    UiThreadUtil.runOnUiThread {
      val fragmentActivity =
        mReactContext.currentActivity as FragmentActivity? ?: return@runOnUiThread
      val bioPrompt = getBiometricPrompt(fragmentActivity)
      val promptInfo = Builder()
        .setAllowedAuthenticators(Authenticators.BIOMETRIC_STRONG)
        .setConfirmationRequired(false)
        .setNegativeButtonText(cancelButton)
        .setDescription(description)
        .setSubtitle(subtitle)
        .setTitle(title)
        .build()
      bioPrompt.authenticate(promptInfo)
    }
  }

  // the below constants are consistent across BiometricPrompt and BiometricManager
  private val sensorError: String?
    get() {
      val biometricManager = BiometricManager.from(mReactContext)
      val authResult = biometricManager.canAuthenticate(Authenticators.BIOMETRIC_WEAK)
      if (authResult == BiometricManager.BIOMETRIC_SUCCESS) {
        return null
      }
      return when (authResult) {
        BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
          "FingerprintScannerNotSupported"
        }

        BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
          "FingerprintScannerNotEnrolled"
        }

        BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
          "FingerprintScannerNotAvailable"
        }

        else -> null
      }
    }

  @ReactMethod
  fun authenticate(
    title: String,
    subtitle: String,
    description: String,
    cancelButton: String,
    promise: Promise?
  ) {
    mPromise = promise
    authCallback?.setPromise(mPromise)
    if (requiresLegacyAuthentication()) {
      legacyAuthenticate()
    } else {
      val errorName = sensorError
      if (errorName != null) {
        if (mPromise != null) {
          mPromise!!.reject(errorName, Constant.TYPE_BIOMETRICS)
        }
        release()
        return
      }
      biometricAuthenticate(title, subtitle, description, cancelButton)
    }
  }

  @ReactMethod
  fun release() {
    if (requiresLegacyAuthentication()) {
      fingerprintIdentify.cancelIdentify()
      mFingerprintIdentify = null
    }

    // consistent across legacy and current API
    if (biometricPrompt != null) {
      biometricPrompt!!.cancelAuthentication() // if release called from eg React
    }
    biometricPrompt = null
    mReactContext.removeLifecycleEventListener(this)
  }

  @ReactMethod
  fun isSensorAvailable(promise: Promise) {
    if (requiresLegacyAuthentication()) {
      val errorMessage = legacyGetErrorMessage()
      if (errorMessage != null) {
        promise.reject(errorMessage, Constant.TYPE_FINGERPRINT_LEGACY)
      } else {
        promise.resolve(Constant.TYPE_FINGERPRINT_LEGACY)
      }
      return
    }

    // current API
    val errorName = sensorError
    if (errorName != null) {
      promise.reject(errorName, Constant.TYPE_BIOMETRICS)
    } else {
      promise.resolve(Constant.TYPE_BIOMETRICS)
    }
  }

  // for Samsung/MeiZu compat, Android v16-23
  private val fingerprintIdentify: FingerprintIdentify
     get() {
      if (mFingerprintIdentify != null) {
        return mFingerprintIdentify!!
      }
      mReactContext.addLifecycleEventListener(this)
      mFingerprintIdentify = FingerprintIdentify(mReactContext)
      mFingerprintIdentify!!.setSupportAndroidL(true)
      mFingerprintIdentify!!.setExceptionListener { mReactContext.removeLifecycleEventListener(this@ReactNativeFingerprintScannerModule) }
      mFingerprintIdentify!!.init()
      return mFingerprintIdentify!!
    }

  private fun legacyGetErrorMessage(): String? {
    if (!fingerprintIdentify.isHardwareEnable) {
      return "FingerprintScannerNotSupported"
    } else if (!fingerprintIdentify.isRegisteredFingerprint) {
      return "FingerprintScannerNotEnrolled"
    } else if (!fingerprintIdentify.isFingerprintEnable) {
      return "FingerprintScannerNotAvailable"
    }
    return null
  }

  private fun legacyAuthenticate() {
    val errorMessage = legacyGetErrorMessage()
    if (errorMessage != null) {
      if (mPromise != null) {
        mPromise!!.reject(errorMessage, Constant.TYPE_FINGERPRINT_LEGACY)
      }
      release()
      return
    }
    fingerprintIdentify.resumeIdentify()
    fingerprintIdentify.startIdentify(MAX_AVAILABLE_TIMES, object : IdentifyListener {
      override fun onSucceed() {
        if (mPromise != null) {
          mPromise!!.resolve(true)
        }
      }

      override fun onNotMatch(availableTimes: Int) {
        if (availableTimes <= 0) {
          mReactContext.getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("FINGERPRINT_SCANNER_AUTHENTICATION", "DeviceLocked")
        } else {
          mReactContext.getJSModule(RCTDeviceEventEmitter::class.java)
            .emit("FINGERPRINT_SCANNER_AUTHENTICATION", "AuthenticationNotMatch")
        }
      }

      override fun onFailed(isDeviceLocked: Boolean) {
        if (mPromise != null) {
          if (isDeviceLocked) {
            mPromise!!.reject("AuthenticationFailed", "DeviceLocked")
          } else {
            mPromise!!.reject("AuthenticationFailed", Constant.TYPE_FINGERPRINT_LEGACY)
          }
        }
        release()
      }

      override fun onStartFailedByDeviceLocked() {
        // the first start failed because the device was locked temporarily
        if (mPromise != null) {
          mPromise!!.reject("AuthenticationFailed", "DeviceLocked")
        }
      }
    })
  }

  companion object {
    const val MAX_AVAILABLE_TIMES = Int.MAX_VALUE
    private const val MODULE = "AndroidFingerprintScanner"
  }
}