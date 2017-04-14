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
      new Wine({ id: 1, name: 'Pinot noir', year: 2011, country: 'France', type: 'red', description: 'Sensual and understated' }),
      new Wine({ id: 2, name: 'Zinfandel', year: 1990, country: 'Croatia', type: 'red', description: 'Thick and jammy' })
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
          .end(function (err, res, body) {
            if (err) throw err;
            assert.equal(body.length, 2);
            done();
          });
      }));

    });

    describe('POST add new wines', function () {

      describe('while validating', sinon.test(function () {

        this.stub(Wine.prototype, 'save', function mockSave (cb) {
          console.log(this);
          return this.validate(cb);
        });

        it('will fail for missing required fields', sinon.test(function (done) {
          api().post('/wines')
            .send({missing: 'everything'})
            .expectStatus(400)
            .end(function (err, res, body) {
              if (err) throw err;
              assert.equal(body.error, 'VALIDATION_ERROR');
              assert.equal(body.validation.year, 'MISSING');
              assert.equal(body.validation.type, 'MISSING');
              assert.equal(body.validation.name, 'MISSING');
              assert.equal(body.validation.country, 'MISSING');
              done();
            });
        }));

        it('will fail for invalid type value', sinon.test(function (done) {
          api().post('/wines')
            .send({year: 2015, type: 'wrong', name: 'Wine', country: 'France'})
            .expectStatus(400)
            .end(function (err, res, body) {
              if (err) throw err;
              assert.equal(body.error, 'VALIDATION_ERROR');
              assert.equal(body.validation.type, 'INVALID');
              done();
            });
        }));

      }));

    });

    describe('PUT update wines', function () {

      describe('while validating', sinon.test(function () {

        this.stub(Wine.prototype, 'save', function mockSave (cb) { return this.validate(cb); });

        it('will fail for invalid type value', sinon.test(function (done) {
          this.stub(Wine, 'findOne', function mockFindOne (opt, cb) {
            cb(null, wineList[1]);
          });
          api().put('/wines/15')
            .send({type: 'wrong'})
            .expectStatus(400)
            .end(function (err, res, body) {
              if (err) throw err;
              assert.notEqual(body, undefined);
              assert.equal(body.error, 'VALIDATION_ERROR');
              assert.equal(body.validation.type, 'INVALID');
              done();
            });
        }));

      }));

      it('fails for non-existing wine', sinon.test(function (done) {
        this.stub(Wine, 'findOne', function mockFindOne (opt, cb) { cb(null, null); });
        api().put('/wines/666')
          .send({year: 2015, type: 'wrong', name: 'Wine', country: 'France'})
          .expectStatus(400)
          .end(function (err, res, body) {
            if (err) throw err;
            assert.equal(body.error, 'UNKNOWN_OBJECT');
            done();
          });
      }));

    });

    describe('DELETE remove wines', function () {

      it('fails for non-existing wine', sinon.test(function (done) {
        this.stub(Wine, 'findOne', function mockFindOne (opt, cb) { cb(null, null); });
        api().put('/wines/666')
          .send({year: 2015, type: 'wrong', name: 'Wine', country: 'France'})
          .expectStatus(400)
          .end(function (err, res, body) {
            if (err) throw err;
            assert.equal(body.error, 'UNKNOWN_OBJECT');
            done();
          });
      }));

    });

  });
});
