var data = require('../helpers/data.js');
var http = require('http');

const dockerSocketPath = '/var/run/docker.sock';

module.exports.getServices = function() {

  var servicesNames = [];
  data.servicesConf.forEach(function(element) {
    servicesNames.push(element["Spec"]["Name"]);
  });

  return servicesNames;
}

module.exports.getServiceConf = function(service) {
  var conf = data.servicesConf.filter(function(element) {
    return service === element["Spec"]["Name"];
  })

  return conf;
}



module.exports.getLogs = function(service) {
  return data.servicesLogs[service];
}



function updateServicesConf() {
  let options = {
    socketPath: dockerSocketPath,
    path: `/v1.29/services`,
    method: 'GET'
  };
  let clientRequest = http.request(options, (res) => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      const parsedData = JSON.parse(rawData);
      data.servicesConf = eval(parsedData);

    });
  });
  clientRequest.on('error', (e) => {

    console.log(e);
  });
  clientRequest.end();
}



function updateServicesLogs() {

  data.servicesConf.forEach(service => {

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
