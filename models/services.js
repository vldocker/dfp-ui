var data = require('../helpers/data.js');
var http = require('http');
var Docker = require('dockerode');
var stream = require('stream');

const dockerSocketPath = '/var/run/docker.sock';
const docker = new Docker({
  socketPath: dockerSocketPath,
  version: 'v1.30'
});

const getServices = function() {
  var servicesNames = [];
  data.servicesConf.forEach(function(element) {
    servicesNames.push(element["Spec"]["Name"]);
  });

  return servicesNames;
}

const getServiceConf = function(service) {
  var conf = data.servicesConf.filter(function(element) {
    return service === element["Spec"]["Name"];
  })

  return conf;
}

const getLogs = function(service) {
  return data.servicesLogs[service];
}

function updateServicesConf() {
  docker.listServices((err, services) => {
    if (err) {
      // TODO: Add error handling
      console.log(err)
    }
    data.servicesConf = services
  });
}

function updateServicesLogs() {
  data.servicesConf.forEach(service => {
    /*var currentServiceInstance = docker.getService(service["ID"])
    var logStream = new stream.PassThrough();
    logStream.on('data', function(chunk){
      console.log(chunk.toString('utf8'));
    });
    currentServiceInstance.logs({
      follow: false,
      stdout: true,
      stderr: true,
      tail: 200,
      isStream: false
    }, function(err, stream){
      if(err) {
        return logger.error(err.message);
      }
      currentServiceInstance.modem.demuxStream(stream, logStream, logStream);
        stream.on('end', function(){
          logStream.end('!stop!');
          stream.destroy();
        });
      });
    });*/
    let options = {
      socketPath: dockerSocketPath,
      path: 'http://v1.29/services/' + service["ID"] + '/logs?stderr=true&stdout=true&timestamps=true&tail=200',
      method: 'GET'
    };
    let clientRequest = http.request(options, (res) => {
      res.setEncoding('utf8');
      let rawData = '';
      res.on('data', (chunk) => {
        rawData += chunk;
      });
      res.on('end', () => {
        data.servicesLogs[service["Spec"]["Name"]] = rawData;
      });
    });
    clientRequest.on('error', (e) => {
      console.log("Error in get logs " + e);
    });
    clientRequest.end();
  });
}

setInterval(function() {
  updateServicesConf();
  updateServicesLogs();
}, 10000);

module.exports = {
  getServices,
  getServiceConf,
  getLogs
}
