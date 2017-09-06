var express = require('express');
var DataManager = require('../dataManager.js');
var router = express.Router();

/* GET returns graph object. */
router.post('/swarm-cluster-graph', function(req, res, next) {

  res.send(DataManager.getGraphViewData());
});


//TODO
/* returns array of all the networks in the cluster*/
router.post('/networks', function(req, res, next) {

  res.json(DataManager.getNetworks());
});

//TODO
/* returns network object*/
router.post('/networks/:network', function(req, res, next) {
  res.json(DataManager.getNetwork(req.params.network));
});

/* returns array of last stderr logs of the service*/
router.post('/stderr-logs/:service', function(req, res, next) {
  res.json(DataManager.getLogs(req.params.service));
});


/* returns configurations object by service name*/
router.post('/conf/:service', function(req, res, next) {
res.json(DataManager.getConf(req.params.service));
});


/* returns stats object of service in proxy network */
router.post('/stats/:service', function(req, res, next) {

  res.json(DataManager.getStats(req.params.service));
});



module.exports = router;
