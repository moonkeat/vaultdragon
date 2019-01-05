const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.MONGODB_URL);
/* istanbul ignore next */
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});

const app = express();

/* istanbul ignore next */
app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const objectController = require('./controllers/object');

app.get('/object/:key?', objectController.get);
app.post('/object', objectController.post);

app.use((err, req, res, next) => {
  console.error(err);
  /* istanbul ignore next */
  res.status(err.httpStatusCode || 500).send({
    error: {
      message: err.message || 'internal server error'
    }
  });
});

app.listen(app.get('port'), () => {
  console.log('App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
