const _ = require('lodash');
const moment = require('moment');
const Object = require('../models/Object');

exports.get = async (req, res, next) => {
  const { key } = req.params;
  if (!key) {
    return next({
      httpStatusCode: 400,
      message: 'key shouldnt be empty'
    });
  }

  let query = { key };

  const { timestamp } = req.query;
  if (timestamp && (timestamp.length === 10 || timestamp.length === 13)) {
    let timestampObject;
    if (timestamp.length === 10) {
      timestampObject = moment.unix(timestamp);
    }
    if (timestamp.length === 13) {
      timestampObject = moment(timestamp, 'x');
    }
    if (!timestampObject.isValid()) {
      return next({
        httpStatusCode: 400,
        message: 'timestamp should be valid'
      });
    }

    query = _.assign(query, {
      createdAt: {
        $lte: timestampObject.toDate(),
      },
    });
  }

  let object;
  try {
    object = await Object.findOne(query, ['value'], {
      sort: {
        createdAt: -1,
      }
    });
  } catch (e) {
    /* istanbul ignore next */
    return next(e);
  }
  if (!object) {
    return next({
      httpStatusCode: 404,
      message: 'key not found'
    });
  }

  res.send({ value: object.value });
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

  const reqValue = body[reqKey];
  if (!_.isObject(reqValue) && !_.isString(reqValue)) {
    return next({
      httpStatusCode: 400,
      message: 'request body\'s value invalid, expecting string or json object'
    });
  }

  const object = Object({
    key: reqKey,
    value: reqValue,
  });

  let savedObject;
  try {
    savedObject = await object.save();
  } catch (e) {
    /* istanbul ignore next */
    return next(e);
  }

  const { key, value, createdAt } = savedObject;

  res.send({
    key,
    value,
    timestamp: createdAt.getTime()
  });
};
