var bleno = require('bleno');

var servicesLib = [
  "pingpong","sysinfo", "routinereceive"
]

for (service of servicesLib) {
  var rsrc = require(`./${service}/service`)
  exports[service] = new rsrc()
}
