var mongoose = require('mongoose');
var restify = require('restify');

var connection = mongoose.connect(process.env.MONGODB_URI);

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

var Wine = mongoose.model('Wine', {
  id: mongoose.Schema.Types.ObjectId,
  name: String,
  year: Number,
  country: String,
  type: String,
  description: String
});

var populateDB = function () {
  new Wine({ name: 'Pinot noir', year: 2011, country: 'France', type: 'red', description: 'Sensual and understated' }).save();
  new Wine({ name: 'Zinfandel', year: 1990, country: 'Croatia', type: 'red', description: 'Thick and jammy' }).save();
};

var server = restify.createServer();
server.use(restify.queryParser());

var filterKeys = function (obj, allowedKeys) {
  return Object.keys(obj)
               .filter(function (key) { return allowedKeys.indexOf(key) !== -1; })
               .reduce(function (res, key) { res[key] = obj[key]; return res; }, { });
};

server.get('/wines', function (req, res, next) {
  var searchOptions = filterKeys(req.params, [ 'year', 'type', 'name', 'country' ]);
  console.log('query options:', searchOptions);
  Wine.find(searchOptions, function (err, wines) {
    if (err) {
      res.json(500, err);
    } else {
      res.json(
        wines.map(function (wine) {
          return filterKeys(
            wine.toObject(),
            ['id', 'year', 'type', 'name', 'country', 'description']);
        })
      );
    }
    next();
  });
});

server.listen(process.env.PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
