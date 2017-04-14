var restify = require('restify');
var models = require('./models');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.jsonBodyParser());

var filterKeys = function (obj, allowedKeys) {
    if (typeof obj === 'undefined') return {};
    return Object.keys(obj)
        .filter(function (key) { return allowedKeys.indexOf(key) !== -1; })
        .reduce(function (res, key) { res[key] = obj[key]; return res; }, { });
};

var Wine = models.Wine;

var requiredAttrs = [ 'year', 'type', 'name', 'country' ];
var optionalAttrs = [ 'description' ];
var exposedAttrs  = [ 'id'] + requiredAttrs + optionalAttrs;

var exposeWine = function (wine) {
    return filterKeys(
        wine.toObject(), exposedAttrs);
};

server.get('/wines', function (req, res) {
    var searchOptions = filterKeys(req.params, requiredAttrs);
    Wine.find(searchOptions, function (err, wines) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(wines.map(exposeWine));
        }
    });
});

server.get('/wines/:id', function (req, res) {
    var id = req.params.id;
    if (!id) {
        res.json(400, {error: 'UNKNOWN_OBJECT'});
    } else {
        Wine.findOne({id: req.params.id}, function (err, wine) {
            if (typeof wine !== 'undefined') {
                res.json(exposeWine(wine));
            } else {
                res.json(400, {error: 'UNKNOWN_OBJECT'})
            }
        });
    }
});

var formatErrorMessage = function (err) {
  var validationErrors = {};
  for (var key in err.errors) {
    if (err.errors.hasOwnProperty(key)) {
      var error = err.errors[key];
      if (error.name === 'ValidatorError') {
        switch (error.kind) {
          case 'required': validationErrors[key] = 'MISSING'; break;
          case 'enum': validationErrors[key] = 'INVALID'; break;
          default: validationErrors[key] = error.message;
        }
      }
    }
  }
  if (validationErrors) {
    return {error: 'VALIDATION_ERROR', validation: validationErrors};
  } else {
    return {error: 'UNKNOWN', message: err}
  }
};

server.post('/wines', function (req, res) {
  var params = filterKeys(req.params, requiredAttrs + optionalAttrs);
  var wine = new Wine(params);
  wine.save(function (err, product, numAffected) {
    if (err) {
      res.json(400, formatErrorMessage(err));
    } else {
        res.json(exposeWine(wine));
    }
  });
});

server.put('/wines/:id', function (req, res) {
  Wine.findOne({id: req.params.id}, function (err, wine) {
    if (typeof wine !== 'undefined') {
      var params = filterKeys(req.body, requiredAttrs + optionalAttrs);
      Object.assign(wine, params);
      wine.save(function (err, product, numAffected) {
          if (err) {
              res.json(400, formatErrorMessage(err));
          } else {
              res.json(exposeWine(wine));
          }
      });
    } else {
      res.json(400, {error: 'UNKNOWN_OBJECT'})
    }
  });
});

server.del('/wines/:id', function (req, res) {
    Wine.findOne({id: req.params.id}, function (err, wine) {
        if (typeof wine !== 'undefined') {
            wine.remove(function (err, wine) {
                if (err) {
                    res.json(400, 'UNKNOWN_ERROR');
                } else {
                    res.json(200, {success: true});
                }
            });
        } else {
            res.json(400, {error: 'UNKNOWN_OBJECT'})
        }
    });
});

module.exports = server;