var bleno = require('bleno');
var util = require('util');
const Constants = require('../../../constants')
const io = require('../../../io')
const dispatcher = require('../../../dispatcher')

const child = require('child_process');
const spawn = child.spawn

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
  console.log("wifi scan request recieved")

  var commaSeparatedNetworkList = "";
  const fetch = spawn("python", ['/home/pi/wkspc/rpi-peripheral/robinslight_processes/essidExtractor.py'])
  fetch.on('data', (chunk) => {
  	  console.log("recieved chunk:", chunk)
      commaSeparatedNetworkList += chunk
  })
  fetch.on('close', (exit_code) => {
  	  console.log("writing buffer")
  	  console.log(commaSeparatedNetworkList)
	  this._value = new Buffer(commaSeparatedNetworkList)
	  callback(this.RESULT_SUCCESS, this._value.slice(offset, this._value.length));
  })

};


module.exports = NetworkScanCharacteristic;
