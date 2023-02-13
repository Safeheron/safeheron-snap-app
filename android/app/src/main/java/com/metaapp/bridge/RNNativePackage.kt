package com.metaapp.bridge

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager
import com.metaapp.bridge.biometric.ReactNativeFingerprintScannerModule
import java.util.ArrayList

/**
 * @author yudenghao
 * @date 2023/2/15
 */
class RNNativePackage : ReactPackage {

  override fun createNativeModules(context: ReactApplicationContext): MutableList<NativeModule> =
    arrayListOf(
      ReactNativeFingerprintScannerModule(context),
    )


  override fun createViewManagers(p0: ReactApplicationContext): MutableList<ViewManager<View, ReactShadowNode<*>>> =
    ArrayList()


}