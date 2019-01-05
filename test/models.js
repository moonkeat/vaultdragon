const { expect } = require('chai');
const sinon = require('sinon');
require('sinon-mongoose');

const Object = require('../models/Object');

describe('Object Model', () => {
  it('should create a new object', (done) => {
    const ObjectMock = sinon.mock(Object({ key: 'mykey', value: 'value1' }));
    const { object } = ObjectMock;

    ObjectMock
      .expects('save')
      .yields(null);

    object.save((err) => {
      ObjectMock.verify();
      ObjectMock.restore();
      expect(err).to.be.null;
      done();
    });
  });
});
