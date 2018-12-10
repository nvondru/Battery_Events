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
    "id": "cordova-plugin-battery-status.Battery",
    "file": "plugins/cordova-plugin-battery-status/src/windows/BatteryProxy.js",
    "pluginId": "cordova-plugin-battery-status",
    "runs": true
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-battery-status": "2.0.2",
  "cordova-plugin-browsersync": "0.1.7"
};
// BOTTOM OF METADATA
});