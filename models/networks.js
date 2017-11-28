var logger = require('winston');
var http = require('http');
var data = require('../helpers/data.js');
var utils = require('../helpers/utils.js');


const dockerSocketPath = '/var/run/docker.sock';

const getNetworks = function() {
  var networksNames = [];
  data.networks.forEach(function(element) {
    networksNames.push(element["Name"]);
  });
  return networksNames;
}

const getNetwork = function(network) {
  var networkConf = data.networks.filter(function(element) {
    return element["Name"] === network;
  })
  return networkConf;
}

function updateNetworks() {
  let options = {
    socketPath: dockerSocketPath,
    path: `/v1.29/networks`,
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
      data.networks = eval(parsedData);

    });
  });
  clientRequest.on('error', (e) => {
    logger.error(e);
  });
  clientRequest.end();
}


setInterval(function() {

 updateNetworks();



}, 10000);

module.exports = {
  getNetworks,
  getNetwork
}
