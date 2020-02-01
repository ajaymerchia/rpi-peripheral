var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;

const child = require('child_process');
const spawn = child.spawn

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
        this._value = version
        callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
    })
  }
};


CheckVersionCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  if (Constants.auth === data) {
    console.log("Updating code from origin...")
    spawn("git", ["pull", "origin", "master"])
  } else {
    console.log("Auth code did not match")
  }
  callback(this.RESULT_SUCCESS);
};

util.inherits(CheckVersionCharacteristic, BlenoCharacteristic);
module.exports = CheckVersionCharacteristic;
