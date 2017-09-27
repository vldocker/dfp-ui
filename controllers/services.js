var express = require('express');
var servicesModel = require('../models/services.js');
var router = express.Router();




/* returns array with all services names */
router.post('/', function(req, res, next) {

  res.json(servicesModel.getServices());
});



/* returns array of last stderr logs of the service*/
router.post('/logs/:service', function(req, res, next) {
  res.json(servicesModel.getLogs(req.params.service));
});


/* returns configurations object by service name*/
router.post('/configurations/:service', function(req, res, next) {
res.json(servicesModel.getServiceConf(req.params.service));
});




module.exports = router;
