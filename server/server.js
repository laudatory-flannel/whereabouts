var express = require('express');
var database = require('./config/database.js');

var app = express();

// require stuff;

// require('')(app, express);

// start listening to requests on local port or port 8000
app.listen(process.env.port || process.env.PORT || 8000);

module.exports = app;