var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')

const child = require('child_process');
const spawn = child.spawn

var BlenoCharacteristic = bleno.Characteristic;

var NetworkDisconnectCharacteristic = function() {
 NetworkDisconnectCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['write'],
    value: null
  });
};
util.inherits(NetworkDisconnectCharacteristic, BlenoCharacteristic);


NetworkDisconnectCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log("Wifi disconnect request recieved...")

  if (Constants.auth === data.toString()) {
    console.log("Wifi disconnect initiated...")
    spawn("ifconfig", ["wlan0", "down"])
  } else {
    console.log("Auth code did not match")
  }

  callback(this.RESULT_SUCCESS)
};


module.exports = NetworkDisconnectCharacteristic;
