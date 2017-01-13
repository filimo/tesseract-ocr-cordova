# Simple Cordova Tesseract-OCR sample - For Android

This is a Cordova app for OCR process using Tesseract library for both Android. [Tesseract](https://github.com/tesseract-ocr/tesseract) is an Open Source library for OCR (Optical Character Recognition) process.

## Installation

### 1. For Android platform:

#### 1.1 Init
```bash
$ npm install -g npm-run
$ npm install
$ npm-run cordova prepare
```

#### 1.2 Download or clone [tess-two project](https://github.com/rmtheis/tess-two) (it contains Tesseract library for Android) and copy the 'tess-two' folder inside of it to your android platform:
```bash
$ git clone https://github.com/rmtheis/tess-two
$ cp -rf tess-two/tess-two/ your-project/platforms/android/tess-two
```

#### 1.3 Edit `your-project/platforms/android/build.gradle` file and add 'tess-two' as a dependency to your project (after `// SUB-PROJECT DEPENDENCIES END` line):
```
dependencies {
     compile fileTree(dir: 'libs', include: '*.jar')
     // SUB-PROJECT DEPENDENCIES START
     debugCompile(project(path: "CordovaLib", configuration: "debug"))
     releaseCompile(project(path: "CordovaLib", configuration: "release"))
     compile "com.android.support:support-v4:24.1.1+"
     // SUB-PROJECT DEPENDENCIES END
     compile 'com.rmtheis:tess-two:6.1.1'
}
```

#### 1.4 Run
```bash
$ npm-run cordova run android
```

### 1.5 Fix for Android 6.0
Before you click "Scan a text" you should change store permission of the app.
Go to setting/application/OCRTest and turn Storage toggle on(or make re-on).



