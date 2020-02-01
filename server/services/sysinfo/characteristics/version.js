var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;

var CheckVersionCharacteristic = function() {
  CheckVersionCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read'],
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

    this._value = new Buffer(JSON.stringify({
      'version' : version
    }));
  }

  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};


CheckVersionCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  spawn("git", ["pull", "origin", "master"])
  callback(this.RESULT_SUCCESS);
};

util.inherits(CheckVersionCharacteristic, BlenoCharacteristic);
module.exports = CheckVersionCharacteristic;
