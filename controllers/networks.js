var express = require('express');
var networksModel = require('../models/networks.js');
var router = express.Router();


/* returns array of all the networks in the cluster*/
router.post('/', function(req, res, next) {

  res.json(networksModel.getNetworks());
});

//TODO
/* returns network object*/
router.post('/configurations/:network', function(req, res, next) {
  res.json(networksModel.getNetworkConf(req.params.network));
});









module.exports = router;
