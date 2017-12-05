var logger = require('winston');
var data = require('../helpers/data.js');
var utils = require('../helpers/utils.js');
var Docker = require('dockerode');

const dockerSocketPath = '/var/run/docker.sock';
const docker = new Docker({
  socketPath: dockerSocketPath,
  version: 'v1.30'
});


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
  docker.listNetworks((err, networks) => {
    if (err) {
      console.log(err)
    }
    data.networks = networks
  })
}

setInterval(function() {
  updateNetworks();
}, 10000);

module.exports = {
  getNetworks,
  getNetwork
}
