# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }

-keepattributes *Annotation*
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}

# react-native-svg https://github.com/react-native-svg/react-native-svg#problems-with-proguard
-keep public class com.horcrux.svg.** {*;}

# react-native-reanimated https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.swmansion.reanimated.** { *; }


# Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }#

# react-native-webrt https://github.com/react-native-webrtc/react-native-webrtc/issues/590
-keep class org.webrtc.** { *; }

# Samsung Fingerprint
-keep class com.wei.android.lib.fingerprintidentify.** { *; }
-keep class com.fingerprints.service.** { *; }
-keep class com.samsung.android.sdk.** { *; }

-keep class com.gyf.immersionbar.** { *; }

-keep public class com.google.android.** {*;}
-keep public class com.google.lwansbrough.** {*;}
-keep public class org.reactnative.** {*;}
-keep class com.metaapp.** { *; }
-keep class com.safeheron.snap.app.** { *; }


# kotlin
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }

-include proguard-modules.pro