'use strict';

const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  webhook = require('./controllers/webhook.js'),
  debtsController = require('./controllers/debts-controller.js');

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.use(express.static('frontend/dist'));
app.use('/webhook', webhook);
app.use('/debts', debtsController);

module.exports = app;