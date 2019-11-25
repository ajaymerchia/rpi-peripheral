var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')

var BlenoCharacteristic = bleno.Characteristic;

var PlayerCharacteristic = function() {
 PlayerCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read', 'write', 'notify'],
    value: null
  });

 this._value = new Buffer(0);
 this._updateValueCallback = null;
};

util.inherits(PlayerCharacteristic, BlenoCharacteristic);

// Given a command (PLAY, PAUSE, START, STOP) control a python subprocess
PlayerCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('PlayerCharacteristic - onWriteRequest: value = ' + this._value.toString());
  var data = this._value.toString().split(":")
  var cmd = data[0]
  var sent = data[1]

  function reportFailure() {
    callback(this.RESULT_UNLIKELY_ERROR);
  }

  if (cmd === "START") {
    dispatcher.runPythonScript("lightshow.py", ["MAIN", sent])
    callback(this.RESULT_SUCCESS);
  } else {
    console.log('PlayerCharacteristic - onWriteRequest: FAIL = ' + "Unknown command sent");
  }



};

PlayerCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('PlayerCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

PlayerCharacteristic.prototype.onUnsubscribe = function() {
  console.log('PlayerCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = PlayerCharacteristic;
