const request = require('supertest');
const mongoose = require('mongoose');
const { assert } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

before(async () => {
  mongoServer = new MongoMemoryServer();
  process.env.PORT = 18888;
  process.env.MONGODB_URL = await mongoServer.getConnectionString();
  app = require('../app.js'); // eslint-disable-line global-require
});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
});

describe('POST /object', () => {
  it('should return 400 if request body is empty', (done) => {
    request(app)
      .post('/object')
      .expect(400, done);
  });

  it('should return 400 if request body is empty object', (done) => {
    request(app)
      .post('/object')
      .send({})
      .expect(400, done);
  });

  it('should return 400 if request body have multiple keys', (done) => {
    request(app)
      .post('/object')
      .send({ key1: 'value1', key2: 'value2' })
      .expect(400, done);
  });

  it('should return 200 OK', (done) => {
    request(app)
      .post('/object')
      .send({ mykey: 'value1' })
      .expect(200)
      .end((err, res) => {
        assert(res.body.key === 'mykey', 'wrong key in response body');
        assert(res.body.value === 'value1', 'wrong value in response body');
        done();
      });
  });
});

describe('GET /object/key', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .get('/object/key')
      .expect(200, {
        value: 'value1',
      }, done);
  });
});
