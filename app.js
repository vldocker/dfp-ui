var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('winston');




var networks = require('./controllers/networks');
var services = require('./controllers/services');
var clusterView = require('./controllers/clusterView');
var dfpServices = require('./controllers/dfpServices');
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("client/build"));
app.use(cookieParser());
app.use('/dfpServices', dfpServices);
app.use('/networks', networks);
app.use('/services', services);
app.use('/clusterView', clusterView);


app.get('/*', function(req, res){
  logger.info("GET  " + req.url);
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  logger.error(err);
  res.send('error');
});

module.exports = app;
