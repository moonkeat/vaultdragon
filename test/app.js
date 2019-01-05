const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongoServer;

before(async () => {
  mongoServer = new MongoMemoryServer();
  process.env.MONGODB_URL = await mongoServer.getConnectionString();
  app = require('../app.js'); // eslint-disable-line global-require
});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
});

describe('POST /object', () => {
  it('should return 200 OK', (done) => {
    request(app)
      .post('/object')
      .send({ mykey: 'value1' })
      .expect(200, {
        key: 'mykey',
        value: 'value1',
      }, done);
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
