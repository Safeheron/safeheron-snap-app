# Safeheron Snap App

## Environment Setup

The code is built using React-Native and running code locally requires a Mac or Linux OS.

- Install [Node.js](https://nodejs.org) version 18 
- Install the shared [React Native dependencies](https://reactnative.dev/docs/environment-setup#installing-dependencies) (React Native CLI, not Expo CLI)
  - Install [Android dependencies](https://reactnative.dev/docs/environment-setup?guide=native&platform=android&os=linux)
  - Install [iOS dependencies](https://reactnative.dev/docs/environment-setup?guide=native&platform=ios&os=macos)

## Running Locally

- Clone this repo.
- Duplicate `.env.example` within the root and rename it to `.env`, add a value for `IOS_SENTRY_DSN` and `ANDROID_SENTRY_DSN`.

### Android Keystore Configuration

```shell
META_APP_STORE_FILE=[your keystore absolute path]
META_APP_RELEASE_KSTOREPWD=[the password of your keystore file]
META_APP_KEY_ALIAS=[the alias name of your keystore file]
META_APP_RELEASE_KEYPWD=[the password of alias]
```

You can create the keystore file via the following command, or Android Studio.
```shell
$ keytool -genkey -v -keystore [your_keystore_name.keystore] -alias [your_alias_name] -keyalg RSA -keysize 2048 -validity [validity_time]
```

### Running

- Install dependencies:
```shell
$ npm install
```
- Run React-Native bundle watch
```shell
$ npm run start
```

Running on your **Android phone**:

````shell
$ npm run android
````

Running on your **iPhone**:

- Open Xcode, open `{PROJECT_NAME}/ios/MetaApp.xcworkspace`
- Connect your iPhone device (system version `14.5.0` or above)
- Select your connected device in Xcode and click Run button

## Build Release Artifacts

### Android build

```shell
sh script/jenkins_build_android.sh [version] [bundle_version_code] [aab | apk]

# example
# sh script/jenkins_build_android.sh 1.1.0 00 aab
```

### iOS build

```shell
sh script/jenkins_build_ios.sh [version] [bundle_version_code] APPSTORE

# example
# sh script/jenkins_build_ios.sh 1.1.0 0 APPSTORE
```
