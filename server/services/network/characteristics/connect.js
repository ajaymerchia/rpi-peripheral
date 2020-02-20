var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')
const fs = require('fs')

const child = require('child_process');
const spawn = child.spawn

var BlenoCharacteristic = bleno.Characteristic;

var NetworkConnectCharacteristic = function() {
 NetworkConnectCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read', 'write'],
    value: null
  });

 this._value = new Buffer(0);
};

util.inherits(NetworkConnectCharacteristic, BlenoCharacteristic);

NetworkConnectCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var commaSeparatedESSIDandPSK = data.toString()
  console.log(commaSeparatedESSIDandPSK);

  commaSeparatedESSIDandPSK = commaSeparatedESSIDandPSK.split(",")
  var network = commaSeparatedESSIDandPSK[0]
  var pass = commaSeparatedESSIDandPSK[1]

  var contentToAddToWPAFile = `network={\n\tssid=\"${network}\"\n\tpsk=\"${pass}\"\n}\n`
  console.log("adding network config to wpa_supplicant");
  console.log(contentToAddToWPAFile);
  fs.appendFileSync('/etc/wpa_supplicant/wpa_supplicant.conf', contentToAddToWPAFile);
  spawn("wpa_cli", ["-i", "wlan0", "reconfigure"]).on('close', (exit) => {
    spawn("ifconfig", ["wlan0", "up"])
  })

  callback(this.RESULT_SUCCESS)
};

NetworkConnectCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var commaSeparatedNetworkList = null

  // set commaSeparatedNetworkList

  this._value = new Buffer(commaSeparatedNetworkList)
  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};

module.exports = NetworkConnectCharacteristic;
