package com.metaapp

import com.facebook.react.ReactActivity
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.concurrentReactEnabled
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.gyf.immersionbar.ImmersionBar

/**
 * @author yudenghao
 * @date 2022/6/21
 */
class MainActivityDelegate(private val activity: ReactActivity, mainComponentName: String) :
  DefaultReactActivityDelegate(activity, mainComponentName, // If you opted-in for the New Architecture, we enable the Fabric Renderer.
    fabricEnabled, // fabricEnabled
    // If you opted-in for the New Architecture, we enable Concurrent React (i.e. React 18).
    concurrentReactEnabled // concurrentRootEnabled
  ) {
  override fun loadApp(appKey: String?) {
    ImmersionBar.with(activity)
      .statusBarDarkFont(true)
      .navigationBarDarkIcon(true)
      .navigationBarColor(android.R.color.transparent)
      .fullScreen(true).init()
    super.loadApp(appKey)
  }
}