const _ = require('lodash');
const Object = require('../models/Object');

exports.get = (req, res) => {
  res.send({ value: 'value1' });
};

exports.post = async (req, res, next) => {
  const { body } = req;
  const keysInBody = _.keys(body);
  if (keysInBody.length !== 1) {
    return next({
      httpStatusCode: 400,
      message: 'request body should have only 1 key'
    });
  }

  const reqKey = keysInBody[0];
  if (!reqKey) {
    return next({
      httpStatusCode: 400,
      message: 'request body\'s key shouldnt be empty'
    });
  }
  const object = Object({
    key: reqKey,
    value: body[reqKey],
  });

  const { key, value, createdAt } = await object.save();

  res.send({
    key,
    value,
    createdAt: createdAt.getTime()
  });
};
