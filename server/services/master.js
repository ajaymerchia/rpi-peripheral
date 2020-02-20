var bleno = require('bleno');

var servicesLib = [
  "pingpong","sysinfo", "routine", "network"
]

for (service of servicesLib) {
  console.log('initializing', service, 'service')
  var rsrc = require(`./${service}/service`)
  exports[service] = new rsrc()
}
