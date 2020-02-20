var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')

var BlenoCharacteristic = bleno.Characteristic;

var NetworkScanCharacteristic = function() {
 NetworkScanCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read'],
    value: null
  });

 this._value = new Buffer(0);
};
util.inherits(NetworkScanCharacteristic, BlenoCharacteristic);


NetworkScanCharacteristic.prototype.onReadRequest = function(offset, callback) {

  var commaSeparatedNetworkList = null;

  // set commaSeparatedNetworkList

  this._value = new Buffer(commaSeparatedNetworkList)
  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};


module.exports = NetworkScanCharacteristic;
