var express = require('express');
var router = express.Router();
var Docker = require('dockerode');

router.post('/', function(req, res, next) {
  var docker = new Docker({
    socketPath: '/var/run/docker.sock',
    version: 'v1.30'
  });
  docker.listContainers(function (err, containers) {
    if (err) {
      console.log(err)
    }
    res.json(containers)
  });
});

module.exports = router;
