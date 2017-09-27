var express = require('express');
var dfpServicesStatsModel = require('../models/dfpServicesStats.js');
var router = express.Router();

router.post('/stats/:service', function(req, res, next) {

  res.json(dfpServicesStats.getStats(req.params.service));
});
