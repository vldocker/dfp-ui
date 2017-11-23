var express = require('express');
var clusterViewModel = require('../models/clusterView.js');
var router = express.Router();
var logger = require('winston');

router.post('/', function(req, res, next) {
  logger.info("get clusterView request");
  res.send(clusterViewModel.getClusterView());
});

module.exports = router;
