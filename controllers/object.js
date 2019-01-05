const _ = require('lodash');
const Object = require('../models/Object');

exports.get = (req, res) => {
  res.send({ value: 'value1' });
};

exports.post = async (req, res) => {
  const { body } = req;
  const keysInBody = _.keys(body);
  if (keysInBody.length !== 1) {
    return res.status(400).send({
      error: {
        message: 'please provide only 1 key in request body'
      }
    });
  }

  const object = Object({
    key: keysInBody[0],
    value: body[keysInBody[0]],
  });

  const { key, value, createdAt } = await object.save();

  res.send({
    key,
    value,
    createdAt: createdAt.getTime()
  });
};
