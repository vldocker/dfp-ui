var sys = require('sys')
var exec = require('child_process').exec;
var request = require('request-promise');
var http = require('http');





/* docker-flow-proxy Env vars*/
var proxyHostAndPort =  process.env.PROXY_HOST_AND_PORT;
var dockerApiVersion = process.env.DOCKER_API_VERSION;


///TODO
var dockerApiUrl = "http://v1." + dockerApiVersion;

/**************************Server state*******************************************/

/*docker swarm cluster states*/
var networks = [];
var services = [];
var servicesConf = [];
var servicesLogs = [];

/*services stats (just those that belongs to proxy network) */
var servicesStats = [];
var proxyServices = [];


/* graph representation of the cluster*/
var graphResponse = {};


/*************************************END*******************************************/




/**************************Cluster state getters*******************************************/

module.exports.getNetworks = function(){
  var networksNames = [];
    networks.forEach(function(element){
    networksNames.push(element["Name"]);
  });
  return networksNames;
}


module.exports.getNetwork = function(network){
    var data = networks.filter(function(element){
    return element["Name"] === network;
  })
  return data;
}

module.exports.getLogs = function(service){
  return servicesLogs[service];
}

module.exports.getStats = function(service){
  var stats = servicesStats.filter(function(element){
    return service === element['svname'];
  })

  return stats;

}

module.exports.getProxyServices = function(){

  return proxyServices;
}


module.exports.getConf = function(service){
    var conf = servicesConf.filter(function(element){
    return service === element["Spec"]["Name"];
  })

  return conf;
}

module.exports.getGraphViewData = function(){
  return graphResponse;
}


/**************************END*******************************************/



/****************************externals Api calls******************************/

/*update networks data from docker api*/
function updateNetworks(){
let options = {
         socketPath: '/var/run/docker.sock',
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
                networks = eval(parsedData);

           });
       });
       clientRequest.on('error', (e) => {
           console.log(e);
       });
       clientRequest.end();

}

function updateServicesConf(){
let options = {
         socketPath: '/var/run/docker.sock',
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
                servicesConf = eval(parsedData);

           });
       });
       clientRequest.on('error', (e) => {
           console.log(e);
       });
       clientRequest.end();
}




function stdoutToJson(stdout){
  var stdoutStr = stdout.toString()
  var confObjIdx = stdoutStr.indexOf('[');
  var confObj = stdoutStr.substr(confObjIdx);

  var jsonStr = JSON.stringify(confObj);
  var jsonObj = JSON.parse(jsonStr);
  return eval(jsonObj);

}

function updateServicesLogs(){

 servicesConf.forEach( service => {

   let options = {
            socketPath: '/var/run/docker.sock',
            path:  'http://v1.29/services/' + service["ID"] + '/logs?stderr=true&timestamps=true&tail=50',
            method: 'GET'
          };
          let clientRequest = http.request(options, (res) => {
              res.setEncoding('utf8');
              let rawData = '';
              res.on('data', (chunk) => {
                  rawData += chunk;
              });
              res.on('end', () => {
                   servicesLogs[service["Spec"]["Name"]] = rawData;

              });
          });
          clientRequest.on('error', (e) => {
              console.log("Error in get logs " + e);
          });
          clientRequest.end();

});

}






function updateFlowProxyServices(){
  var api = proxyHostAndPort + '/v1/docker-flow-proxy/config?type=json';
   request({
    uri: api,
    json: true
  })
    .then((data) => {
      setProxyServices(data);
    })
    .catch((err) => {
      console.log(err)
    })
}


function setProxyServices(unFilteredConf){
  var services = [];
  var proxyServicesList = [];
  for (var property in unFilteredConf) {
    proxyServicesList.push(property);
}
proxyServices = proxyServicesList;

}



function getEmptyStatsObj(){
  var emptyStatsObj =
 {  svname: "",
    bin: 0,
    bout: 0,
    hrsp_1xx: 0,
    hrsp_2xx: 0,
    hrsp_3xx: 0,
    hrsp_4xx: 0,
    hrsp_5xx: 0,
    hrsp_other: 0,
    req_tot: 0,
    qtime: 0,
    ctime: 0,
    rtime: 0,
    ttime: 0
     };

     return emptyStatsObj;

}


function updateServicesStats(){
  var api = proxyHostAndPort + '/v1/docker-flow-proxy/metrics?distribute=true';
   request({
    uri: api,
    method:"GET"
  })
    .then((data) => {
     var jsonString = csvJSON(data);
     var jsonData = JSON.parse(csvJSON(data));
     var arrayData = Object.keys(jsonData).map(function (key) { return jsonData[key]; });
     aggregateServicesStats(arrayData);
    })
    .catch((err) => {
      console.log(err)
    })
}



function aggregateServicesStats(data){
    var updatedStats = [];
    var proxyNames = getPropertyValues('# pxname', data);
    proxyNames.splice(proxyNames.length - 2, 2);
    var servicesNames = getPropertyValues('svname', data);
   servicesNames.splice(servicesNames.length - 2, 2);

   ///aggregated by proxyName
   servicesNames.forEach(function(name){
    var totalService = getEmptyStatsObj();
    totalService['svname'] = name;
    var filteredServiceStats = data.filter(function(element){
      return element['svname'] === name && element['svname'] !== 'BACKEND' && element['svname'] !== 'FRONTEND';

    });

    if(filteredServiceStats.length > 0){
      filteredServiceStats.forEach(function(serviceInstance){
        totalService.bin += Number(serviceInstance.bin);
        totalService.bout += Number(serviceInstance.bout);
        totalService.hrsp_2xx += Number(serviceInstance.hrsp_2xx);
        totalService.hrsp_4xx += Number(serviceInstance.hrsp_4xx);
        totalService.hrsp_5xx += Number(serviceInstance.hrsp_5xx);
        var totalRes = Number(serviceInstance.hrsp_other) + Number(serviceInstance.hrsp_1xx) + Number(serviceInstance.hrsp_2xx)
         + Number(serviceInstance.hrsp_3xx) + Number(serviceInstance.hrsp_4xx) +  Number(serviceInstance.hrsp_5xx);
         var othersRes = Number(serviceInstance.hrsp_other) + Number(serviceInstance.hrsp_1xx) + Number(serviceInstance.hrsp_3xx);
        totalService.qtime += Number(serviceInstance.qtime / filteredServiceStats.length );
        totalService.ctime += Number(serviceInstance.ctime / filteredServiceStats.length );
        totalService.rtime += Number(serviceInstance.rtime / filteredServiceStats.length );
        totalService.ttime += Number(serviceInstance.ttime / filteredServiceStats.length );
        totalService.hrsp_other +=  othersRes;
        totalService.req_tot += totalRes;
      })
    }
    updatedStats.push(totalService);
   });

   servicesStats = updatedStats;
}


function updateGraphResponse(){
  var networkNames = [];
  var currentNetworksInCluster = [];
  var mapNetworkIdToNetworkName = [];
  var nodeToNetwork = [];
  var nodesNames = [];
  networks.forEach(function(network){
    mapNetworkIdToNetworkName[network['Id']] = network["Name"];
    networkNames.push(network["Name"]);
  });

  var servicesRelatedToNetworks = servicesConf.filter(function(service){
    return service["Spec"]["TaskTemplate"]["Networks"] !== undefined;
    });
    servicesRelatedToNetworks.forEach(function(service){
      service["Spec"]["TaskTemplate"]["Networks"].forEach(function(network){
        nodesNames.push(service["Spec"]["Name"]);
        var target =
        contains(networkNames, network["Target"])
        ? network["Target"]
        : mapNetworkIdToNetworkName[network["Target"]];
        currentNetworksInCluster.push(target);
      nodeToNetwork.push({from:service["Spec"]["Name"], to:target})
      });

    });

graphResponse = {nodes:Array.from(new Set(nodesNames)), networks:Array.from(new Set(currentNetworksInCluster)), edges:nodeToNetwork};
}


/* Utils */

function contains(array, value){
  for (var i = 0; i < array.length; i++) {
    if (array[i] === value){
      return true;
    }
  }
  return false;
}


function csvJSON(csv){
  var lines=csv.split("\n");
  var result = [];
  var headers=lines[0].split(",");
  for(var i=1;i<lines.length;i++){
    var obj = {};
    var currentline=lines[i].split(",");
    for(var j=0;j<headers.length;j++){
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }

  return JSON.stringify(result);
}


function getPropertyValues(property, jsonObj){
  var values = [];
  for (var i = 0; i < jsonObj.length; i++) {
    values.push(jsonObj[i][property]);
  }

  return Array.from(new Set(values));
}



function updateAllStates(){
  updateNetworks();
  updateServicesConf();
  updateServicesLogs();
  updateFlowProxyServices();
  updateServicesStats();
  updateGraphResponse();
}

updateAllStates();

/* update cluster state every 10 seconds*/
setInterval(function () {

  updateAllStates();


}, 10000);
