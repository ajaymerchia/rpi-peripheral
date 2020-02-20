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
  if (Constants.auth === data.toString()) {
    // set status color
    dispatcher.runPythonScript("status_indicator.py", ["orange"]);
    console.log("NOT IMPLEMENTED");

    // sync.on('close', (code) => {
    //   console.log(`child process exited with code ${code}`);
    //   callback(this.RESULT_SUCCESS);
    //   // spawn("shutdown", ["now"])
    // });
  } else {
      console.log("Failed to validate auth for date sync request");
      callback(this.RESULT_SUCCESS);
  }

};

util.inherits(DateSyncCharacteristic, BlenoCharacteristic);
module.exports = DateSyncCharacteristic;
