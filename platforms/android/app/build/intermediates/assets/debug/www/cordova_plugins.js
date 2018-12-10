cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-battery-status.battery",
    "file": "plugins/cordova-plugin-battery-status/www/battery.js",
    "pluginId": "cordova-plugin-battery-status",
    "clobbers": [
      "navigator.battery"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.geolocation",
    "file": "plugins/cordova-plugin-geolocation/www/android/geolocation.js",
    "pluginId": "cordova-plugin-geolocation",
    "clobbers": [
      "navigator.geolocation"
    ]
  },
  {
    "id": "cordova-plugin-geolocation.PositionError",
    "file": "plugins/cordova-plugin-geolocation/www/PositionError.js",
    "pluginId": "cordova-plugin-geolocation",
    "runs": true
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-browsersync": "0.1.7",
  "cordova-plugin-battery-status": "2.0.2",
  "cordova-plugin-geolocation": "4.0.1"
};
// BOTTOM OF METADATA
});