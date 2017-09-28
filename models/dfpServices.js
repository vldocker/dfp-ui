var logger = require('winston');
var http = require('http');
var data = require('../helpers/data.js');
var request = require('request-promise');
var utils = require('../helpers/utils.js');
var proxyHostAndPort = "http://35.160.251.220:8080";
///process.env.PROXY_HOST_AND_PORT;
var dockerApiVersion = process.env.DOCKER_API_VERSION;

module.exports.getStats = function(service) {
  var stats = data.dfpServicesStats.filter(function(element) {
    console.log(typeof element.svname);
    console.log(typeof service);
    console.log( element.svname);
    console.log( service);
    console.log( service === element.svname);
    return service === element['svname'];
  })

  return stats.pop();

}

module.exports.getServices = function() {

  return data.dfpServices;
}



function updateFlowProxyServices() {
  var api = proxyHostAndPort + '/v1/docker-flow-proxy/config?type=json';
  request({
      uri: api,
      json: true
    })
    .then((data) => {
      setProxyServices(data);
    })
    .catch((err) => {
      logger.error("Error while trying to get HAProxy services configurations from docker-flow-proxy Api\n" + err);
    })
}


function setProxyServices(unFilteredConf) {
  var services = [];
  var proxyServicesList = [];
  for (var property in unFilteredConf) {
    proxyServicesList.push(property);
  }
  proxyServices = proxyServicesList;

}



function getEmptyStatsObj() {
  var emptyStatsObj = {
    svname: "",
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


function updateServicesStats() {
  var api = proxyHostAndPort + '/v1/docker-flow-proxy/metrics?distribute=true';
  request({
      uri: api,
      method: "GET"
    })
    .then((data) => {
      var jsonString = utils.csvJSON(data);
      var jsonData = JSON.parse(utils.csvJSON(data));
      var arrayData = Object.keys(jsonData).map(function(key) {
        return jsonData[key];
      });
      aggregateServicesStats(arrayData);
    })
    .catch((err) => {
        logger.error("Error while trying to get HAProxy services stats from docker-flow-proxy Api\n" +  err);
    })
}



function aggregateServicesStats(servicesStats) {
  var updatedStats = [];
  var proxyNames = utils.getPropertyValues('# pxname', servicesStats);
  proxyNames.splice(proxyNames.length - 2, 2);
  var servicesNames = utils.getPropertyValues('svname', servicesStats);
  servicesNames.splice(servicesNames.length - 2, 2);

  ///aggregated by proxyName
  servicesNames.forEach(function(name) {
    var totalService = getEmptyStatsObj();
    totalService['svname'] = name;
    var filteredServiceStats = servicesStats.filter(function(element) {
      return element['svname'] === name && element['svname'] !== 'BACKEND' && element['svname'] !== 'FRONTEND';

    });

    if (filteredServiceStats.length > 0) {
      filteredServiceStats.forEach(function(serviceInstance) {
        totalService.bin += Number(serviceInstance.bin);
        totalService.bout += Number(serviceInstance.bout);
        totalService.hrsp_2xx += Number(serviceInstance.hrsp_2xx);
        totalService.hrsp_4xx += Number(serviceInstance.hrsp_4xx);
        totalService.hrsp_5xx += Number(serviceInstance.hrsp_5xx);
        var totalRes = Number(serviceInstance.hrsp_other) + Number(serviceInstance.hrsp_1xx) + Number(serviceInstance.hrsp_2xx) +
          Number(serviceInstance.hrsp_3xx) + Number(serviceInstance.hrsp_4xx) + Number(serviceInstance.hrsp_5xx);
        var othersRes = Number(serviceInstance.hrsp_other) + Number(serviceInstance.hrsp_1xx) + Number(serviceInstance.hrsp_3xx);
        totalService.qtime += Number(serviceInstance.qtime / filteredServiceStats.length);
        totalService.ctime += Number(serviceInstance.ctime / filteredServiceStats.length);
        totalService.rtime += Number(serviceInstance.rtime / filteredServiceStats.length);
        totalService.ttime += Number(serviceInstance.ttime / filteredServiceStats.length);
        totalService.hrsp_other += othersRes;
        totalService.req_tot += totalRes;
      })
    }
    updatedStats.push(totalService);
  });

  data.dfpServices = proxyNames;
  data.dfpServicesStats = updatedStats;


}



setInterval(function() {
  updateServicesStats();

}, 10000);
