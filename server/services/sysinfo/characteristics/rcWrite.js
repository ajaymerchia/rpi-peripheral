var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;
const dispatcher = require('../../../dispatcher')

const child = require('child_process');
const spawn = child.spawn

var RCWriteCharacteristic = function() {
    RCWriteCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['write'],
  });

 this._value = new Buffer(0);
};

function runUpdate() {
  const fetch = spawn("sh", ["rcWriter"]).on('close', (code) => {
      console.log(code)
    })
  fetch.stdout.pipe(process.stdout);
  fetch.stderr.pipe(process.stdout);
}

RCWriteCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var shutdown = null
  if (Constants.auth === data.toString()) {
    console.log("Initiating rc.local overwrite.")
    runUpdate()

  } else {
      console.log("Failed to validate auth for rcWrite request");
  }
  callback(this.RESULT_SUCCESS);

};

util.inherits(RCWriteCharacteristic, BlenoCharacteristic);
module.exports = RCWriteCharacteristic;

runUpdate();