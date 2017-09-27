var express = require('express');
var clusterViewModel = require('../models/clusterView.js');
var router = express.Router();


router.post('/', function(req, res, next) {

  res.send(clusterViewModel.getClusterView());
});


module.exports = router;
