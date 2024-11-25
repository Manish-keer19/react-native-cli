# to create react-native cli apk whithout expo

npx @react-native-community/cli init YourProjectName

# to initialize the Ts react-native project

npx @react-native-community/cli init YourProjectName --template react-native-template-typescript --npm

# go to this directory

```
C:\MyCode\WebDevlopment\instafrontend\instaclone\node_modules\react-native\ReactAndroid\cmake-utils\default-app-setup\CMakeLists.txt
```

# and remove code of CMakeLists.txt and add this code becuase it give error of /U like stufs

```
# Copyright (c) Meta Platforms, Inc. and affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

# This CMake file is the default used by apps and is placed inside react-native
# to encapsulate it from user space (so you won't need to touch C++/Cmake code at all on Android).
#
# If you wish to customize it (because you want to manually link a C++ library or pass a custom
# compilation flag) you can:
#
# 1. Copy this CMake file inside the `android/app/src/main/jni` folder of your project
# 2. Copy the OnLoad.cpp (in this same folder) file inside the same folder as above.
# 3. Extend your `android/app/build.gradle` as follows
#
# android {
#    // Other config here...
#    externalNativeBuild {
#        cmake {
#            path "src/main/jni/CMakeLists.txt"
#        }
#    }
# }

cmake_minimum_required(VERSION 3.13)

# Define the library name here.
project(appmodules)

# Fix path for REACT_ANDROID_DIR (if needed, convert backslashes to forward slashes)
string(REPLACE "\\" "/" REACT_ANDROID_DIR ${REACT_ANDROID_DIR})

# This file includes all the necessary to let you build your application with the New Architecture.
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

```

# after initialize the project create a local.properties file in android folder

```
sdk.dir=C:\\Users\\manish keer\\AppData\\Local\\Android\\Sdk
```

# bundle the js code that can run in android

```
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

# this command is to generate android apk

```
cd android
./gradlew assembleDebug
```

## This will generate a debug APK in the android/app/build/outputs/apk/debug folder
