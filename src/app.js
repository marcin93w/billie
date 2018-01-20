'use strict';

const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  webhook = require('./controllers/webhook.js'),
  debtsController = require('./controllers/debts-controller.js'),
  textSvg = require('./controllers/text-svg.js');

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-psid,x-signed-request,x-thread-id,x-thread-type');

    next();
}

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

if(process.env.NODE_ENV === 'development') {
    app.use(allowCrossDomain);
}

app.use(express.static('frontend/dist'));
app.use('/webhook', webhook);
app.use('/debts', debtsController);
app.use('/svg', textSvg);

module.exports = app;