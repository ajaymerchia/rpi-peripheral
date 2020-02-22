var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;

const child = require('child_process');
const spawn = child.spawn
const dispatcher = require('../../../dispatcher')


var CheckVersionCharacteristic = function() {
  CheckVersionCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read', 'write'],
  });

 this._value = new Buffer(0);
};

CheckVersionCharacteristic.prototype.onReadRequest = function(offset, callback) {
  if (!offset) {
    var totalversion = spawn("git", ["log", "--pretty=oneline"])
    var version = ""
    totalversion.stdout.setEncoding('utf8');
    totalversion.stdout.on('data', (chunk) => {
        version += chunk
    });

    totalversion.on('close', (done) => {
      version = version.split("\n")[0]
      console.log("Current version is: ", version)
      this._value = new Buffer(version);
	console.log(this._value);
       callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
    })
  }
};


CheckVersionCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  function reportFailure() {
    dispatcher.runPythonScript("status_indicator.py", ["red", 45]).on('close', (code) => {
      dispatcher.runPythonScript("status_indicator.py", ["green"]);
    })
    callback(this.RESULT_UNLIKELY_ERROR);
  }


  if (Constants.auth === data.toString()) {
    console.log("Updating code from origin...")
    dispatcher.runPythonScript("status_indicator.py", ["orange"])

    const fetch = spawn("git", ["pull", "origin", "master"])
	  fetch.stdout.pipe(process.stdout);
    fetch.on('close', (code) => {
      if (code == 0) {
        dispatcher.runPythonScript("status_indicator.py", ["green"]);
        callback(this.RESULT_SUCCESS);
      } else {
        reportFailure()
      }
    })

  } else {
    console.log("Auth code did not match")
    reportFailure()
  }

};

util.inherits(CheckVersionCharacteristic, BlenoCharacteristic);
module.exports = CheckVersionCharacteristic;
