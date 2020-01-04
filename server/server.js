var bleno = require('bleno');
var dispatch = require('./dispatcher')

// Initialize Services
var Services = require('./services/master');

var allServiceIDs = []
var allServices = []
var serviceIDtoService = {}

process.env['BLENO_DEVICE_NAME'] = 'robinsPi'

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

  if (state === 'poweredOn') {
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
    if (options.cleanup) setIndicator("clear")
    if (exitCode || exitCode === 0) console.log(exitCode)
    if (options.exit) process.exit();
}

var events = ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"]
for (event of events) {
    process.on(event, exitHandler.bind(null, {cleanup: true}))
}
