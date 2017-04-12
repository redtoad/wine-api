
'use strict';

var http = require('http');
var models = require('./lib/models');
var server = require('./lib/server');

var populateDB = function () {
  new models.Wine({ name: 'Pinot noir', year: 2011, country: 'France', type: 'red', description: 'Sensual and understated' }).save();
  new models.Wine({ name: 'Zinfandel', year: 1990, country: 'Croatia', type: 'red', description: 'Thick and jammy' }).save();
};

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
