var logger = require('winston');
var axios = require('axios');
var data = require('../helpers/data.js');
var utils = require('../helpers/utils.js');
var proxyHostAndPort = process.env.PROXY_HOST_AND_PORT;

const getStats = function(service) {
  logger.info("dfp stats request to service" + service);
  var stats = data.dfpServicesStats.filter(function(element) {
    return service === element['svname'];
  })
  
  return stats.pop();
}

const getServices = function() {
  return data.dfpServices;
}

function updateFlowProxyServices() {
  var api = proxyHostAndPort + '/v1/docker-flow-proxy/config?type=json';
  axios.get(api)
  .then((res) => {
    setProxyServices(res.data)
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

function statsObject() {
  return {
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
}

function updateServicesStats() {
  var api = proxyHostAndPort + '/v1/docker-flow-proxy/metrics?distribute=true';
  axios.get(api)
  .then((res) => {
    var jsonString = utils.csvJSON(res.data);
    var jsonData = JSON.parse(utils.csvJSON(res.data));
    var arrayData = Object.keys(jsonData).map(function(key) {
      return jsonData[key];
    });
    aggregateServicesStats(arrayData);
  })
  .catch((err) => {
    logger.error("Error while trying to get HAProxy services configurations from docker-flow-proxy Api\n" + err);
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
    var totalService = statsObject();
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

module.exports = {
  getStats,
  getServices
}

setInterval(function() {
  updateServicesStats();
}, 10000);
