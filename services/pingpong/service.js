var bleno = require('bleno');
var util = require('util');
const Constants = require('../../constants')
var characteristicNames = ["pingpong"]




// default builder
var characteristics = []
for (var name of characteristicNames) {
  var CharType = require(`./characteristics/${name}`)
  characteristics.push(new CharType())
}

function PingPongService() {
  bleno.PrimaryService.call(this, {
    uuid: Constants.uuidFor(module.filename),
    characteristics: characteristics
  });
};

util.inherits(PingPongService, bleno.PrimaryService);
module.exports = PingPongService;
