#!/bin/zsh

if [ $# -lt 3 ]; then
  echo 'missing required params, $1=APP_VERSION $2=BUILD_CODE $3=ASSEMBLE_TYPE'
  exit 1
fi

ARG1=$1
ARG2=$2
ARG3=$3
ASSEMBLE_TYPE='assemble'

if [ "$ARG3" = "aab" ] || [ "$ARG3" = "AAB" ]; then
  ASSEMBLE_TYPE="bundle"
fi

echo "ASSEMBLE_TYPE =  ${ASSEMBLE_TYPE}"


APK_NAME=release/app-release.apk
AAB_NAME=release/app-release.aab

APP_VERSION=$ARG1
BUILD_CODE=$ARG2
ARCHIVE_NAME="Safeheron_Snap_${APP_VERSION}_${BUILD_CODE}"

ROOT_PATH=$PWD
OUTPUT_PATH=$ROOT_PATH/build/android

ORIGIN_APK_PATH=$ROOT_PATH/android/app/build/outputs/apk/$APK_NAME
ORIGIN_AAB_PATH=$ROOT_PATH/android/app/build/outputs/bundle/$AAB_NAME

APK_PATH=$OUTPUT_PATH/$ARCHIVE_NAME.apk
AAB_PATH=$OUTPUT_PATH/$ARCHIVE_NAME.aab

echo '==================== PATH ===================='
echo "ORIGIN_APK_PATH = $ORIGIN_APK_PATH"
echo "ORIGIN_AAB_PATH = $ORIGIN_AAB_PATH"
echo "APK_PATH = $APK_PATH"
echo "AAB_PATH = $AAB_PATH"
echo '==================== PATH ===================='

if [ ! -d "$OUTPUT_PATH" ]; then
  mkdir -p $OUTPUT_PATH
fi

ANDROID_APP_VERSION="-Papp_version=$ARG1"
ANDROID_BUILD_CODE="-Pbuild_code=$ARG2"

npm ci

if [ $? -ne 0 ]; then
  echo "npm install failed"
  exit 1
fi

cd android

echo "Clean start...."
./gradlew clean
echo "Clean completed...."

echo 'Build start...'
echo "./gradlew :app:${ASSEMBLE_TYPE}Release ${ANDROID_APP_VERSION} ${ANDROID_BUILD_CODE}"
./gradlew :app:${ASSEMBLE_TYPE}Release $ANDROID_APP_VERSION ${ANDROID_BUILD_CODE}
if [ $? -ne 0 ]; then
  echo "Build failed."
  exit 1
fi
echo 'Build completed.'


if [ $ASSEMBLE_TYPE == 'bundle' ]; then
 echo 'Move aab'
 echo "mv $ORIGIN_AAB_PATH $AAB_PATH"
 mv $ORIGIN_AAB_PATH $AAB_PATH
else
 echo 'Move apk'
 echo "mv $ORIGIN_APK_PATH $APK_PATH"
 mv $ORIGIN_APK_PATH $APK_PATH
fi

if [ $? -ne 0 ]; then
 echo "Move failed 💣💣💣"
 exit 1
fi

