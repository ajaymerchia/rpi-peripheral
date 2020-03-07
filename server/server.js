var bleno = require('bleno');
var dispatch = require('./dispatcher')

const child = require('child_process');
const spawn = child.spawn

// Initialize Services
var Services = require('./services/master');

var allServiceIDs = []
var allServices = []
var serviceIDtoService = {}

var fs = require('fs')

var deviceName = 'robinsPi'
try {
  var givenName = fs.readFileSync("../data/name", "utf8")
  if (givenName) { deviceName = givenName }
} catch (err) {
  console.log(err);
}
process.env['BLENO_DEVICE_NAME'] = deviceName

for (serviceName of Object.keys(Services)) {
  var service = Services[serviceName];
  allServiceIDs.push(service.uuid)
  allServices.push(service)
  serviceIDtoService[service.uuid] = service
}

function setIndicator(color) {
    dispatch.runPythonScript("status_indicator.py", [color])
}

bleno.on('stateChange', function(state) {
  console.log('on -> stateChange: ' + state);
  bleno.name = process.env['BLENO_DEVICE_NAME'] = deviceName

  if (state === 'poweredOn') {
    console.log(`Powered on as ${bleno.name}`);
    for (serviceID of allServiceIDs) {
      console.log(`Launching ${serviceIDtoService[serviceID].constructor.name}(${serviceID})`);
      bleno.startAdvertising(bleno.name, [serviceID]);
    }
  }
  else {
    bleno.stopAdvertising();
    setIndicator("red")
  }
});



bleno.on('advertisingStart', function(error) {

  console.log('on -> advertisingStart: ' +
    (error ? 'error ' + error : 'success')
  );

  if (!error) {
    console.log(`Advertising as ${process.env.BLENO_DEVICE_NAME}`)
    bleno.setServices(allServices);

    // indicate that services are up and running with a yellow indicator light
    setIndicator("blue")

  }
});


bleno.on('accept', (address) => {
  console.log('on -> accept: ' + address);
    setIndicator("green")

})

bleno.on('disconnect', (address) => {
  console.log('on -> disconnect: ' + address);
    setIndicator("blue")
})

function exitHandler(options, exitCode) {
    setIndicator("clear")
    console.log(exitCode)
    process.exit();
}

var events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"]
for (event of events) {
    process.on(event, exitHandler.bind(null, {cleanup: true}))
}

setInterval((unused) => {
  spawn('date')
}, 1000 * 10)
