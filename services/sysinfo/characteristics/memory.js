var bleno = require('bleno');
var os = require('os');
var util = require('util');
const Constants = require('../../../constants')
var BlenoCharacteristic = bleno.Characteristic;

var MemoryCharacteristic = function() {
 MemoryCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read'],
  });

 this._value = new Buffer(0);
};

MemoryCharacteristic.prototype.onReadRequest = function(offset, callback) {

  if(!offset) {

    this._value = new Buffer(JSON.stringify({
      'freeMemory' : os.freemem(),
      'totalMemory' : os.totalmem()
    }));
  }

    console.log('MemoryCharacteristic - onReadRequest: value = ' +
      this._value.slice(offset, offset + bleno.mtu).toString()
    );

  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};

util.inherits(MemoryCharacteristic, BlenoCharacteristic);
module.exports = MemoryCharacteristic;
