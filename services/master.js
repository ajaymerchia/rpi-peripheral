var bleno = require('bleno');

var servicesLib = [
  "pingpong","sysinfo"
]

for (service of servicesLib) {
  var rsrc = require(`./${service}/service`)
  exports[service] = new rsrc()
}
//
// var SystemInformationService = require('./sysinfo/service');
// var systemInformationService = new SystemInformationService();
//
// exports.sysinfo = systemInformationService
