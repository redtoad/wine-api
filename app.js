
'use strict';

var mongoose = require('mongoose');
var http = require('http');

var models = require('./lib/models');
var server = require('./lib/server');

mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + process.env.MONGODB_URI);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

mongoose.connect(process.env.MONGODB_URI);

var populateDB = function () {
  new models.Wine({ name: 'Pinot noir', year: 2011, country: 'France', type: 'red', description: 'Sensual and understated' }).save();
  new models.Wine({ name: 'Zinfandel', year: 1990, country: 'Croatia', type: 'red', description: 'Thick and jammy' }).save();
};

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
