var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')

var BlenoCharacteristic = bleno.Characteristic;

var RoutineReceiverCharacteristic = function() {
 RoutineReceiverCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read', 'write', 'notify'],
    value: null
  });

 this._value = new Buffer(0);
 this._updateValueCallback = null;
};

util.inherits(RoutineReceiverCharacteristic, BlenoCharacteristic);

// will eventually respond with lastModified for MAIN.rl.min
RoutineReceiverCharacteristic.prototype.onReadRequest = function(offset, callback) {
  console.log('RoutineReceiverCharacteristic - onReadRequest: value = ' + this._value.toString());

  callback(this.RESULT_SUCCESS, this._value);
};

RoutineReceiverCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('RoutineReceiverCharacteristic - onWriteRequest: value = ' + this._value.toString());

  function reportFailure() {
    dispatcher.runPythonScript("status_indicator.py", ["red", 45]).on('close', (code) => {
      dispatcher.runPythonScript("status_indicator.py", ["green"]);
    })
    callback(this.RESULT_UNLIKELY_ERROR);
  }
  dispatcher.runPythonScript("status_indicator.py", ["orange"]);

  io.store("MAIN.rl.min", this._value.toString())
  .then((success) => {
    if (success) {
      // orange loading light
      compilation = dispatcher.runPythonScript("rl_compiler.py", ["MAIN"])
      compilation.on('close', (code) => {
        if (code == 0) {
          dispatcher.runPythonScript("status_indicator.py", ["green"]);
        } else {
          // flash red to indicate an error, then set to green
          reportFailure()
        }
      })
      console.log("Succesfully wrote file!");
      callback(this.RESULT_SUCCESS);
    } else {
      reportFailure()
    }
  })
  .catch((err) => {
    console.log('RoutineReceiverCharacteristic - onWriteRequest: FAIL = ' + err);
    reportFailure()
  })


};

RoutineReceiverCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
  console.log('RoutineReceiverCharacteristic - onSubscribe');

  this._updateValueCallback = updateValueCallback;
};

RoutineReceiverCharacteristic.prototype.onUnsubscribe = function() {
  console.log('RoutineReceiverCharacteristic - onUnsubscribe');

  this._updateValueCallback = null;
};

module.exports = RoutineReceiverCharacteristic;
