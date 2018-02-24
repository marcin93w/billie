'use strict';

const 
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()),
  webhook = require('./controllers/webhook.js'),
  debtsController = require('./controllers/debts-controller.js'),
  errorHandler = require('./controllers/error-handler.js');

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,x-signed-request');

    next();
}

app.listen(process.env.PORT || 1337, () => console.log('app started'));

if(process.env.NODE_ENV === 'development') {
    app.use(allowCrossDomain);
}

app.use(express.static('frontend/dist', {
    setHeaders: function(res, path) {
        if (path.indexOf("index.html") !== -1) {
            res.header('Cache-Control', 'public, max-age=360');
        }
    }
}));
app.use('/assets', express.static('assets'));
app.use('/webhook', webhook);
app.use('/debts', debtsController);
app.use('/errorHandler', errorHandler);
app.get('/privacy', function(req, res) {
    res.redirect('https://termsfeed.com/privacy-policy/d69122341e558761c7a56e0ae60b28ef');
});

module.exports = app;