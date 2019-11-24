var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;

var UptimeCharacteristic = function() {
 UptimeCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read'],
  });

 this._value = new Buffer(0);
};

UptimeCharacteristic.prototype.onReadRequest = function(offset, callback) {
  if(!offset) {

    this._value = new Buffer(JSON.stringify({
      'uptime' : os.uptime()
    }));
  }

  console.log('UptimeCharacteristic - onReadRequest: value = ' +
    this._value.slice(offset, offset + bleno.mtu).toString()
  );

  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};

util.inherits(UptimeCharacteristic, BlenoCharacteristic);
module.exports = UptimeCharacteristic;
