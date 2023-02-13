#!/bin/zsh

if [ $# -lt 3 ]; then
  echo 'missing required params, $1=APP_VERSION $2=BUILD_VERSION $3=SCHEME'
  exit 1
fi

if ! (echo $1 | grep -E '^\d+(\.\d+){2}$'); then
  echo 'invaild $1 APP_VERSION'
  exit 1
fi

COMMIT_ID=$(git rev-parse --short HEAD)
SCHEME=MetaApp

notify() {
  local state=$1
  local result=$2

  # replace here if your have a custom notify callback
  if [ "$state" == true ]; then
    echo "Build success"
  else
    echo "Build failed: $result"
  fi
}

KEYCHAIN=$HOME/Library/Keychains/iOS.keychain-db

SDK=iphoneos
ROOT_PATH=$PWD/ios
WORKSPACE_PATH=$ROOT_PATH/MetaApp.xcworkspace
TARGET_PATH=$ROOT_PATH/MetaApp/Target/$SCHEME
INFO_PLIST_PATH=$TARGET_PATH/info.plist
EXPORT_OPTIONS_PLIST_PATH=$TARGET_PATH/ExportOptions.plist
EXPORT_PATH=$ROOT_PATH/../build/ios

DERIVED_DATA_PATH=$EXPORT_PATH/deriveData

ARCHIVE_NAME=$SCHEME.xcarchive
ARCHIVE_PATH=$EXPORT_PATH/$ARCHIVE_NAME
ARCHIVE_ZIP_PATH=$ARCHIVE_PATH.tar.bz2

DSYMS_PATH=$ARCHIVE_PATH/dSYMs
DSYMS_NAME=dSYMs
DSYMS_ZIP_PATH=$EXPORT_PATH/$DSYMS_NAME.tar.bz2

APP_NAME=MetaApp.app
APP_PATH=$DERIVED_DATA_PATH/Build/Products/Release-$SDK
APP_ZIP_PATH=$EXPORT_PATH/$APP_NAME.tar.bz2

IPA_PATH=$EXPORT_PATH/MetaApp.ipa
MANIFEST_PATH=$EXPORT_PATH/manifest.plist



if [ ! -d "$EXPORT_PATH" ]; then
  mkdir -p $EXPORT_PATH
fi

npm ci

if [ $? -ne 0 ]; then
  echo "npm install failed"
  exit 1
fi


cd ios

bundle install

if [ $? -ne 0 ]; then
  echo "bundle install failed"
  exit 1
fi

bundle exec pod install

if [ $? -ne 0 ]; then
  echo "bundle exec pod install failed"
  exit 1
fi


/usr/libexec/Plistbuddy -c "Set CFBundleShortVersionString $1" "$INFO_PLIST_PATH"

if [ $? -ne 0 ]; then
  echo "Plistbuddy failed"
  exit 1
fi

if [ $2 ]; then
  /usr/libexec/Plistbuddy -c "Set CFBundleVersion $2" "$INFO_PLIST_PATH"
fi


if [ -z $IOS_SENTRY_DSN ]; then
  echo "IOS_SENTRY_DSN is not exists"
  exit 1
fi
/usr/libexec/Plistbuddy -c "Set SentryDSN $IOS_SENTRY_DSN" "$INFO_PLIST_PATH"

xcodebuild clean -workspace $WORKSPACE_PATH -scheme $SCHEME -sdk $SDK -configuration release -allowProvisioningUpdates

if [ $? -ne 0 ]; then
  echo "xcodebuild clean failed"
  exit 1
fi

RN_CID=$COMMIT_ID xcodebuild archive -workspace $WORKSPACE_PATH -scheme $SCHEME -sdk $SDK -configuration release -archivePath $ARCHIVE_PATH -allowProvisioningUpdates | bundle exec xcpretty

if [ ${PIPESTATUS[0]} -ne 0 ]; then
  echo "xcodebuild archive failed"
  exit 1
fi

if [ $3 != "APPSTORE" ]; then
  xcodebuild -exportArchive -archivePath $ARCHIVE_PATH -exportPath $EXPORT_PATH -exportOptionsPlist $EXPORT_OPTIONS_PLIST_PATH -allowProvisioningUpdates
  if [ $? -ne 0 ]; then
    echo "xcodebuild export failed"
    exit 1
  fi
fi

tar -jcvf $ARCHIVE_ZIP_PATH -C $EXPORT_PATH $ARCHIVE_NAME
tar -jcvf $DSYMS_ZIP_PATH -C $ARCHIVE_PATH $DSYMS_NAME
