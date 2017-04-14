
'use strict';

var mongoose = require('mongoose');
var http = require('http');

var models = require('./lib/models');
var server = require('./lib/server');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';
const PORT = process.env.PORT || 8080;

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + MONGODB_URI);
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

mongoose.connect(MONGODB_URI);

server.listen(PORT, function () {
  console.log('%s listening at %s', server.name, server.url);
});
