## init project
npx react-native init prettyLandFirebase

cd prettyLandFirebase && npx react-native run-android
## fix bug after init android project
-mkdir android/app/src/main/assets
-npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
-npx react-native run-android

cd prettyLandFirebase" && npx react-native run-ios
## fix bug after init ios project
cd ios && npx pod-install
-open xcode and build (build success without space name of project or path)
-add empty file main.jsbundle
-run script to generate msin.jsbundle data
npx react-native bundle --dev false --entry-file index.js --bundle-output ios/main.jsbundle --platform ios
