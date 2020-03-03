var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')

const child = require('child_process');
const spawn = child.spawn

var BlenoCharacteristic = bleno.Characteristic;

var ForgetNetworksCharacteristic = function() {
 ForgetNetworksCharacteristic.super_.call(this, {
    uuid: Constants.uuidFor(module.filename),
    properties: ['write'],
    value: null
  });
};
util.inherits(ForgetNetworksCharacteristic, BlenoCharacteristic);


ForgetNetworksCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
  console.log("Wifi forget request recieved...")

  if (Constants.auth === data.toString()) {
    console.log("Wifi forget initiated...")
    dispatcher.runPythonScriptWithStatus("network_memory_reset.py", None)
  } else {
    console.log("Auth code did not match")
  }

  callback(this.RESULT_SUCCESS)
};


module.exports = ForgetNetworksCharacteristic;
