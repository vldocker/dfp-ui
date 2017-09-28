var express = require('express');
var dfpServicesModel = require('../models/dfpServices.js');
var router = express.Router();



router.post('/', function(req, res, next) {
  console.log("here");
  res.json(dfpServicesModel.getServices());
});

router.post('/stats/:service', function(req, res, next) {

  res.json(dfpServicesModel.getStats(req.params.service));
});

module.exports = router;
