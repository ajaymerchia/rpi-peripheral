var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;
const dispatcher = require('../../../dispatcher')

const child = require('child_process');
const spawn = child.spawn

var RCWriteCharacteristic = function() {
    ShutdownCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['write'],
  });

 this._value = new Buffer(0);
};

RCWriteCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var shutdown = null
  if (Constants.auth === data.toString()) {
    console.log("Initiating rc.local overwrite.")
    const fetch = spawn("sh", ["rcWriter"])
  } else {
      console.log("Failed to validate auth for rcWrite request");
  }
  callback(this.RESULT_SUCCESS);

};

util.inherits(ShutdownCharacteristic, BlenoCharacteristic);
module.exports = ShutdownCharacteristic;
