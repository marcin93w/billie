'use strict';

const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  webhook = require('./webhook.js');

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.use(express.static('frontend/dist'));
app.use('/webhook', webhook);

module.exports = app;