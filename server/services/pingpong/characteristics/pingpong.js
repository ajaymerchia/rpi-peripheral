var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;
const dispatcher = require('../../../dispatcher')

var PingPongCharacteristic = function() {
 PingPongCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read', 'write', 'notify'],
    value: null
  });

 this._value = new Buffer(0);
 this._updateValueCallback = null;
};

util.inherits(PingPongCharacteristic, BlenoCharacteristic);

PingPongCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('PingPongCharacteristic - onReadRequest: value = ' + this._value.toString());
  dispatcher.runPythonScript("status_indicator.py", ["pink", 45]);

  setTimeout(()=> {
    dispatcher.runPythonScript("status_indicator.py", ["green"]);
  }, 3000)

  callback(this.RESULT_SUCCESS, this._value);
};

PingPongCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('PingPongCharacteristic - onWriteRequest: value = ' + this._value.toString());

  if (this._updateValueCallback) {
    console.log('PingPongCharacteristic - onWriteRequest: notifying');

    this._updateValueCallback(this._value);
  }
  callback(this.RESULT_SUCCESS);
};

PingPongCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('PingPongCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

PingPongCharacteristic.prototype.onUnsubscribe = function() {
  console.log('PingPongCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = PingPongCharacteristic;
