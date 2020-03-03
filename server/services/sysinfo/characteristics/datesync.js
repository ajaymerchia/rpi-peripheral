var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;

const child = require('child_process');
const spawn = child.spawn

var DateSyncCharacteristic = function() {
    DateSyncCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['write'],
  });

 this._value = new Buffer(0);
};

DateSyncCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log("Datesync request recieved...")

  if (Constants.auth === data.toString()) {
    console.log("Datesync initiated.")
    spawn("date")
  } else {
    console.log("Auth code did not match")
  }

  callback(this.RESULT_SUCCESS)

};

util.inherits(DateSyncCharacteristic, BlenoCharacteristic);
module.exports = DateSyncCharacteristic;
