const moment = require('moment');
const request = require('supertest');
const mongoose = require('mongoose');
const { assert } = require('chai');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Object = require('../models/Object');

let app;
let mongoServer;

const veryLongTimeAgo = moment().add(-2, 'day');
const longTimeAgo = moment().add(-1, 'day');

before(async () => {
  mongoServer = new MongoMemoryServer();
  process.env.PORT = 18888;
  process.env.MONGODB_URL = await mongoServer.getConnectionString();
  app = require('../app.js'); // eslint-disable-line global-require

  await Object({
    key: 'mykey',
    value: 'oldervalue',
    createdAt: veryLongTimeAgo.toDate(),
    updatedAt: veryLongTimeAgo.toDate(),
  }).save();

  await Object({
    key: 'mykey',
    value: 'oldvalue',
    createdAt: longTimeAgo.toDate(),
    updatedAt: longTimeAgo.toDate(),
  }).save();
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

  it('should return 400 if request body\'s key is empty', (done) => {
    request(app)
      .post('/object')
      .send({ '': 'value1' })
      .expect(400, done);
  });

  it('should return 400 if request body\'s value is not valid', (done) => {
    request(app)
      .post('/object')
      .send({ mykey: null })
      .expect(400, done);
  });

  it('should return 200 if request body\'s value is json object', (done) => {
    request(app)
      .post('/object')
      .send({ mykey: { hello: 'world' } })
      .expect(200)
      .end((err, res) => {
        assert.strictEqual(res.body.key, 'mykey', 'wrong key in response body');
        assert.deepEqual(res.body.value, { hello: 'world' }, 'wrong value in response body');
        done();
      });
  });

  it('should return 200 if request body\'s value is string', (done) => {
    request(app)
      .post('/object')
      .send({ mykey: 'value1' })
      .expect(200)
      .end((err, res) => {
        assert.strictEqual(res.body.key, 'mykey', 'wrong key in response body');
        assert.strictEqual(res.body.value, 'value1', 'wrong value in response body');
        done();
      });
  });
});

describe('GET /object/key', () => {
  it('should return 400 if key is undefined', (done) => {
    request(app)
      .get('/object')
      .expect(400, done);
  });

  it('should return 400 if key is empty', (done) => {
    request(app)
      .get('/object/')
      .expect(400, done);
  });

  it('should return 400 if key is empty', (done) => {
    request(app)
      .get('/object/   ')
      .expect(400, done);
  });

  it('should return 404 if key not exists', (done) => {
    request(app)
      .get('/object/notexists')
      .expect(404, done);
  });

  it('should return 200 with latest value if request is valid', (done) => {
    request(app)
      .get('/object/mykey')
      .expect(200, {
        value: 'value1',
      }, done);
  });

  it('should return 400 if timestamp invalid', (done) => {
    request(app)
      .get('/object/mykey')
      .query({ timestamp: 'isinvalidtime' })
      .expect(400, done);
  });

  it('should return 200 with the old value created before the provided timestamp', (done) => {
    request(app)
      .get('/object/mykey')
      .query({ timestamp: longTimeAgo.toDate().getTime() })
      .expect(200, {
        value: 'oldvalue',
      }, done);
  });

  it('should return 200 with the older value created before the provided timestamp', (done) => {
    request(app)
      .get('/object/mykey')
      .query({ timestamp: veryLongTimeAgo.toDate().getTime() })
      .expect(200, {
        value: 'oldervalue',
      }, done);
  });

  it('should return 200 with the shorter timestamp (seconds)', (done) => {
    request(app)
      .get('/object/mykey')
      .query({ timestamp: Math.round(veryLongTimeAgo.add(1, 'second').toDate().getTime() / 1000) })
      .expect(200, {
        value: 'oldervalue',
      }, done);
  });
});
