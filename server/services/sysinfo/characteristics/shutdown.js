var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;
const dispatcher = require('../../../dispatcher')

const child = require('child_process');
const spawn = child.spawn

var ShutdownCharacteristic = function() {
    ShutdownCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read'],
  });

 this._value = new Buffer(0);
};

ShutdownCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var shutdown = null
  if (Constants.auth === data) {
    shutdown = dispatcher.runPythonScript("status_indicator.py", ["clear", 45]);
    shutdown.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      callback(this.RESULT_SUCCESS);
      spawn("shutdown", ["now"])
    });
  }

};

util.inherits(ShutdownCharacteristic, BlenoCharacteristic);
module.exports = ShutdownCharacteristic;
