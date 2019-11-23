var bleno = require('bleno');
var util = require('util');

var characteristicNames = ["pingpong", "echo"]

var characteristics = []
for (var name of characteristicNames) {
  var CharType = require(`./characteristics/${name}`)
  characteristics.push(new CharType())
}

var PingPongCharacteristic   = require('./characteristics/pingpong');
var EchoCharacteristic   = require('./characteristics/echo');

function PingPongService() {
  bleno.PrimaryService.call(this, {
    uuid: '8e66b5c3-9851-4a29-8252-295ad263f4b0',
    characteristics: characteristics
  });
};

util.inherits(PingPongService, bleno.PrimaryService);
module.exports = PingPongService;
