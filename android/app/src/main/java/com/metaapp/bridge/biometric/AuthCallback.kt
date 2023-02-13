package com.metaapp.bridge.biometric

import androidx.biometric.BiometricPrompt
import androidx.biometric.BiometricPrompt.AuthenticationCallback
import androidx.biometric.BiometricPrompt.AuthenticationResult
import com.facebook.react.bridge.Promise

/**
 * @author yudenghao
 * @date 2022/2/25
 */
internal class AuthCallback : AuthenticationCallback() {
  private var mPromise: Promise? = null
  fun setPromise(promise: Promise?) {
    mPromise = promise
  }

  override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
    super.onAuthenticationError(errorCode, errString)
    if (mPromise != null) {
      mPromise!!.reject("$errorCode", biometricPromptErrName(errorCode))
    }
  }

  override fun onAuthenticationSucceeded(result: AuthenticationResult) {
    super.onAuthenticationSucceeded(result)
    if (mPromise != null) {
      mPromise!!.resolve(true)
    }
  }

  private fun biometricPromptErrName(errCode: Int): String {
    return when (errCode) {
      BiometricPrompt.ERROR_CANCELED -> "SystemCancel"
      BiometricPrompt.ERROR_HW_NOT_PRESENT -> "FingerprintScannerNotSupported"
      BiometricPrompt.ERROR_HW_UNAVAILABLE -> "FingerprintScannerNotAvailable"
      BiometricPrompt.ERROR_LOCKOUT -> "DeviceLocked"
      BiometricPrompt.ERROR_LOCKOUT_PERMANENT -> "DeviceLockedPermanent"
      BiometricPrompt.ERROR_NEGATIVE_BUTTON -> "UserCancel"
      BiometricPrompt.ERROR_NO_BIOMETRICS -> "FingerprintScannerNotEnrolled"
      BiometricPrompt.ERROR_NO_DEVICE_CREDENTIAL -> "PasscodeNotSet"
      BiometricPrompt.ERROR_NO_SPACE -> "DeviceOutOfMemory"
      BiometricPrompt.ERROR_TIMEOUT -> "AuthenticationTimeout"
      BiometricPrompt.ERROR_UNABLE_TO_PROCESS -> "AuthenticationProcessFailed"
      BiometricPrompt.ERROR_USER_CANCELED -> "UserCancel"
      BiometricPrompt.ERROR_VENDOR ->         // hardware-specific error codes
        "HardwareError"
      else -> "FingerprintScannerUnknownError"
    }
  }
}