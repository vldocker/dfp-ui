var utils = require('../helpers/utils.js');
var data = require('../helpers/data.js');



module.exports.getClusterView = function() {
  return data.graphResponse;
}

function updateClusterView() {
  var networkNames = [];
  var currentNetworksInCluster = [];
  var mapNetworkIdToNetworkName = [];
  var nodeToNetwork = [];
  var nodesNames = [];
   if(data.networks.length > 0 && data.services.length > 0){

     var networks = data.networks;
     var servicesConf = data.servicesConf;

  networks.forEach(function(network) {
    mapNetworkIdToNetworkName[network['Id']] = network["Name"];
    networkNames.push(network["Name"]);
  });

  var servicesRelatedToNetworks = servicesConf.filter(function(service) {
    return service["Spec"]["TaskTemplate"]["Networks"] !== undefined;
  });

  servicesRelatedToNetworks.forEach(function(service) {
    service["Spec"]["TaskTemplate"]["Networks"].forEach(function(network) {
      nodesNames.push(service["Spec"]["Name"]);
      var target =
        utils.contains(networkNames, network["Target"]) ?
        network["Target"] :
        mapNetworkIdToNetworkName[network["Target"]];
      currentNetworksInCluster.push(target);
      nodeToNetwork.push({
        from: service["Spec"]["Name"],
        to: target
      })
    });

  });

  data.graphResponse = {
    nodes: Array.from(new Set(nodesNames)),
    networks: Array.from(new Set(currentNetworksInCluster)),
    edges: nodeToNetwork
  };
}
}



setInterval(function() {

  updateClusterView();


}, 15000);
