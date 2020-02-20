var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;
const io = require('../../../io')

const child = require('child_process');
const spawn = child.spawn

var NameCharacteristic = function() {
    NameCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['write'],
  });

 this._value = new Buffer(0);
};

NameCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var newName = data.toString()
  if (newName) {
      io.store("name", newName)
      console.log(`Updated Device Name to ${newName}`);
      callback(this.RESULT_SUCCESS);
  } else {
      console.log("Failed to read new name for device");
      callback(this.RESULT_SUCCESS);
  }

};

util.inherits(ShutdownCharacteristic, BlenoCharacteristic);
module.exports = ShutdownCharacteristic;
