var hippie = require('hippie');
var assert = require('assert');
var sinon = require('sinon');
var sinonTest = require('sinon-test');

var server = require('../lib/server');
var models = require('../lib/models');

sinon.test = sinonTest.configureTest(sinon);

describe('API', function () {

  var api = function () { return hippie(server).json(); };
  var Wine = models.Wine;

  describe('/wines endpoint', function () {

    var wineList = [
      new Wine({ id: 1, name: 'Pinot noir', year: 2011, country: 'France',  type: 'red', description: 'Sensual and understated'}),
      new Wine({ id: 2, name: 'Zinfandel',  year: 1990, country: 'Croatia', type: 'red', description: 'Thick and jammy'})
    ];

    describe('GET list of wines', function () {

    it('returns all wines', sinon.test(function (done) {
      this.stub(Wine, 'find', function mockFind (opt, cb) { cb(null, wineList); });
      api().get('/wines')
        .expectStatus(200)
        .end(function (err, res, body) {
          if (err) throw err;
            done();
        });
    }));

    it('will ignore invalid query parameters', sinon.test(function (done) {
      this.stub(Wine, 'find', function mockFind (opt, cb) { cb(null, wineList); });
      api().get('/wines?something=')
        .expectStatus(200)
        .end(function(err, res, body) {
          if (err) throw err;
          assert.equal(body.length, 2);
          done();
        });
    }));

    });
  });
});