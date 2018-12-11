# Battery Events

## Introduction
This app tracks information about the charging cycles of your phone. Currently this only works properly when the app is opened while connecting/disconncting your phone. 

**If the app runs in background or wasn't even started, data will not be tracked at all or will show incorrect timestamps and charge-levels.**

The app runs on all android phones and can easily be installed using the provided *.apk* file. 

In order to display location data and Google-maps, your phone needs an **active internet connection** when using the app.

For testing purposes, the app generated some sample entries everytime it's opened. This can be manually disabled by removing the function call to 'insertSampleData()' in 'index.js'.

## Development environment
This hybrid app was developed using Cordova for multi-platform usage. To set up an environment to develop such an app, follow [this guide](https://ict-berufsbildung.info/course/view.php?id=91&section=4). (You need login-credentials for ict-berufsbildung). For further information about the dependencies of all the elements, read the first chapter of the provided documentation.
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
- install cordova 
```
    npm install -g cordova
```
- Navigate to the desired folder
- Create a new Project 
```
    cordova create "name"
```
- Replace the content of the www-folder with the content of the provided www-folder from project "Battery-Events"
- add all plugins and simulations needed
```
     npm install -g cordova-simulate
     cordova plugin add cordova-plugin-battery-status
     cordova plugin add cordova-plugin-geolocation
     cordova plugin add cordova-plugin-browsersync
```
- add all platforms needed
```
    cordova platform add browser
    cordova platform add android
```
- To simulate an android device in your browser (**Google Chrome is heavily recommended!**):
```
    simulate android
```
- To run in your browser (**Google Chrome is heavily recommended!**): 
```
    cordova run browser
```
- To build an installable .apk  
```
    cordova build android
```

 


