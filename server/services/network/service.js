var bleno = require('bleno');
var util = require('util');
const Constants = require('../../constants')
var characteristicNames = ["scan", "connect", "disconnect", "forget"]




// default builder
var characteristics = []
for (var name of characteristicNames) {
  var CharType = require(`./characteristics/${name}`)
  characteristics.push(new CharType())
}

function NetworkService() {
  bleno.PrimaryService.call(this, {
    uuid: Constants.uuidFor(module.filename),
    characteristics: characteristics
  });
};

util.inherits(NetworkService, bleno.PrimaryService);
module.exports = NetworkService;
