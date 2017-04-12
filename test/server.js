var hippie = require('hippie');
var mongoose = require('mongoose');
var assert = require('assert');
var sinon = require('sinon');
require('sinon-mongoose');

var server = require('../lib/server');
var models = require('../lib/models');

describe('Server', function () {

    var api = function () { return hippie(server).json(); };

    describe('/wines endpoint', function () {

        var Wine = models.Wine;
        var WineMock = sinon.mock(Wine);

        var wineList = [
            new Wine({ id: 1, name: 'Pinot noir', year: 2011, country: 'France',  type: 'red', description: 'Sensual and understated'}),
            new Wine({ id: 2, name: 'Zinfandel',  year: 1990, country: 'Croatia', type: 'red', description: 'Thick and jammy'})
        ];

        describe('GET wines', function (done) {

            it('returns all wines in db', function (done) {
                WineMock
                    .expects('find')
                    .yields(null, wineList);
                api().get('/wines')
                    .expectStatus(200)
                    .end(function(err, res, body) {
                        if (err) throw err;
                        assert.equal(body.length, 2);
                        done();
                    });
            });
        });
    });
});