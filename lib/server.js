var restify = require('restify');
var models = require('./models');

var server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.jsonBodyParser());

var filterKeys = function (obj, allowedKeys) {
    return Object.keys(obj)
        .filter(function (key) { return allowedKeys.indexOf(key) !== -1; })
        .reduce(function (res, key) { res[key] = obj[key]; return res; }, { });
};

var Wine = models.Wine;

server.get('/wines', function (req, res) {
    var searchOptions = filterKeys(req.params, [ 'year', 'type', 'name', 'country' ]);
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
    });
});

server.get('/wines/:id', function (req, res) {
    var id = req.params.id;
    if (!id) {
        res.json(400, {error: "UNKNOWN"});
    } else {
        Wine.findById(id, function (err, wine) {
            if (typeof wine !== 'undefined') {
                res.json(wine.toObject());
            } else {
                res.json(400, {error: "UNKNOWN"})
            }
        });
    }
});

server.post('/wines', function (req, res) {
    try {
        res.json(req.body);
    } catch (e) {
        res.json(400, {error: 'ERROR'});
    }
});

server.put('/wines/:id', function () {

});

module.exports = server;