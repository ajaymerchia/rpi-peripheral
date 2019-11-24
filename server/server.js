var bleno = require('bleno');

// Initialize Services
var Services = require('./services/master');

var allServiceIDs = []
var allServices = []
var serviceIDtoService = {}

for (serviceName of Object.keys(Services)) {
  var service = Services[serviceName];
  allServiceIDs.push(service.uuid)
  allServices.push(service)
  serviceIDtoService[service.uuid] = service
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
  }
});



bleno.on('advertisingStart', function(error) {

  console.log('on -> advertisingStart: ' +
    (error ? 'error ' + error : 'success')
  );

  if (!error) {
    bleno.setServices(allServices);
  }
});


bleno.on('accept', (address) => {
  console.log('on -> accept: ' + address);
})

bleno.on('disconnect', (address) => {
  console.log('on -> disconnect: ' + address);
})
