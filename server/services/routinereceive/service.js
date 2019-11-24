var bleno = require('bleno');
var util = require('util');
const Constants = require('../../constants')
var characteristicNames = ["routinereceive"]




// default builder
var characteristics = []
for (var name of characteristicNames) {
  var CharType = require(`./characteristics/${name}`)
  characteristics.push(new CharType())
}

function RoutineReceiverService() {
  bleno.PrimaryService.call(this, {
    uuid: Constants.uuidFor(module.filename),
    characteristics: characteristics
  });
};

util.inherits(RoutineReceiverService, bleno.PrimaryService);
module.exports = RoutineReceiverService;
