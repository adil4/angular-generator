/**
 * Main application file
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';
import http from 'http';
import seedDatabaseIfNeeded from './config/seed';

// Connect to MongoDB
//mongoose.connect(config.mongo.uri, config.mongo.options);
//mongoose.connection.on('error', function(err) {
//  console.error(`MongoDB connection error: ${err}`);
//  process.exit(-1); // eslint-disable-line no-process-exit
//});

mongoose.connect('mongodb://mydatabase:mydatabase@ds155418.mlab.com:55418/angular');

mongoose.connection.on('connected',function(){
  console.log('Connected Mongo');
});
mongoose.connection.on('error',function(){
  console.log('Error Mongo');
  process.exit(-1); // eslint-disable-line no-process-exit

});
mongoose.connection.on('disconnected',function(){
  console.log('Disconnected Mongo');
});

// Setup server
var app = express();
var server = http.createServer(app);
var socketio = require('socket.io')(server, {
  serveClient: config.env !== 'production',
  path: '/socket.io-client'
});
require('./config/socketio').default(socketio);
require('./config/express').default(app);
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

seedDatabaseIfNeeded();
setImmediate(startServer);

// Expose app
exports = module.exports = app;
