#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
const asyncHandler = require('./async-handler');
const mongoClient = require('./config/mongo');
const mongoConfig = require("./config/databaseConfig");
const globals = require('./globals');
var debug = require('debug')('demo:server');
var http = require('http');

const env = process.env.NODE_ENV || "localhost";
/**
* Get port from environment and store in Express.
*/

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;

  /**
 * Open a database connection
 */
  setupDatabase();

  console.log(`Listening on ${bind} : http://localhost:${addr.port}`);
  debug('Listening on ' + bind);
}

async function setupDatabase() {
  // Connect to mongo and pass any options here
  let [mongoErr, client] = await asyncHandler(
    mongoClient(mongoConfig.MONGO_URL, mongoConfig.MONGO_OPTIONS)
  );

  if (mongoErr) {
    console.error(mongoErr.message);
    process.exit(1);
  }

  // Save the client in another module in order to be used accross the entire service
  globals.set("CLIENT", client);
}

const exitHandler = (signal) => {
  console.log(`Received signal ${signal}.`)
  if (mongoClient) {
    console.log('MongoDB connection closed.')
    mongoClient.close();
  }
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);
