# Battery Events

## Introduction
This app tracks information about the charging cycles of your phone. Currently this only works properly when the app is opened while connecting/disconncting your phone. If the app runs in background or wasn't even started, data will not be tracked at all or will show incorrect timestamps and charge-levels.

The app runs on all android phones and can easily be installed using the provided *.apk* file. 

## Development environment
This hybrid app was developed using Cordova for multi-platform usage. To set up an environment to develop such an app, follow [this guide](https://ict-berufsbildung.info/course/view.php?id=91&section=4). (You need login-credentials for ict-berufsbildung). Alternatively you can read the first chapter of the provided documentation.
The environment contains the following modules:
- Node.js
- JDK
- Android Studio & SDK
- Cordova
- USB-Driver (optional)
- Text Editor (Visual Studio Code)

## Get the code running
After setting up the environment follow this steps to get the source code up and running:

- Open Visual Studio Code Terminal (CTRL + SHIFT + ")
- Navigate to the project folder
- install cordova -> npm install -g cordova
- Run "simulate android" to simulate an android device in your browser (**Google Chrome is heavily recommended!**)


