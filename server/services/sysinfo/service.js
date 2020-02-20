var bleno = require('bleno');
var util = require('util');
const Constants = require('../../constants')
var characteristicNames = ["version", "shutdown", "rcWrite"]




// default builder
var characteristics = []
for (var name of characteristicNames) {
  var CharType = require(`./characteristics/${name}`)
  characteristics.push(new CharType())
}

function SystemInformationService() {
  bleno.PrimaryService.call(this, {
    uuid: Constants.uuidFor(module.filename),
    characteristics: characteristics
  });
};

util.inherits(SystemInformationService, bleno.PrimaryService);
module.exports = SystemInformationService;
