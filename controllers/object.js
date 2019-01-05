exports.get = (req, res) => {
  res.send({ value: 'value1' });
};

exports.post = (req, res) => {
  res.send({
    key: 'mykey',
    value: 'value1',
  });
};
