var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')

var BlenoCharacteristic = bleno.Characteristic;

var NetworkConnectCharacteristic = function() {
 NetworkConnectCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['read', 'write'],
    value: null
  });

 this._value = new Buffer(0);
};

util.inherits(NetworkConnectCharacteristic, BlenoCharacteristic);

NetworkConnectCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  var commaSeparatedESSIDandPSK = data.toString()

  callback(this.RESULT_SUCCESS)
};

NetworkConnectCharacteristic.prototype.onReadRequest = function(offset, callback) {
  var commaSeparatedNetworkList = null

  // set commaSeparatedNetworkList

  this._value = new Buffer(commaSeparatedNetworkList)
  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
};

module.exports = NetworkConnectCharacteristic;
