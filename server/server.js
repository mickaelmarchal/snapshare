var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync(__dirname + '/cert/privatekey.pem').toString();
var certificate = fs.readFileSync(__dirname + '/cert/certificate.pem').toString();
var credentials = {key: privateKey, cert: certificate};

var express = require('express');
var mongoProxy = require('./lib/mongo-proxy');
var config = require('./config.js');
var passport = require('passport');
var security = require('./lib/security');
var xsrf = require('./lib/xsrf');
var protectJSON = require('./lib/protectJSON');
require('express-namespace');

var app = express();
var secureServer = https.createServer(credentials, app);
var server = http.createServer(app);

require('./lib/routes/static').addRoutes(app, config);

app.use(protectJSON);

// Log requests to the console
app.use(express.logger());

// Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(express.bodyParser());

// Hash cookies with this secret
app.use(express.cookieParser(config.server.cookieSecret));

// Store the session in the (secret) cookie
app.use(express.cookieSession());

// Initialize PassportJS
app.use(passport.initialize());

// Use Passport's session authentication strategy - this stores the logged in user in the session and will now run on any request
app.use(passport.session());

// Add XSRF checks to the request
app.use(xsrf);

// Add a Mongo strategy for handling the authentication
security.initialize(config.mongo.dbUrl, config.mongo.apiKey, config.security.dbName, config.security.usersCollection);

app.use(function(req, res, next) {
  if (req.user) {
    console.log('Current User:', req.user.firstName, req.user.lastName);
  } else {
    console.log('Unauthenticated');
  }

  next();
});

app.namespace('/databases/:db/collections/:collection*', function() {
  app.all('/', function(req, res, next) {
    if (req.method !== 'GET') {
      // We require the user is authenticated to modify any collections
      security.authenticationRequired(req, res, next);
    } else {
      next();
    }
  });

  app.all('/', function(req, res, next) {
    if (req.method !== 'GET' && (req.params.collection === 'users' || req.params.collection === 'projects')) {

      // We require the current user to be admin to modify the users or projects collection
      return security.adminRequired(req, res, next);
    }

    next();
  });

  // Proxy database calls to the MongoDB
  app.all('/', mongoProxy(config.mongo.dbUrl, config.mongo.apiKey));
});

require('./lib/routes/security').addRoutes(app, security);
require('./lib/routes/appFile').addRoutes(app, config);

// A standard error handler - it picks up any left over errors and returns a nicely formatted server 500 error
app.use(express.errorHandler({dumpExceptions: true, showStack: true}));

// Start up the server on the port specified in the config
server.listen(config.server.listenPort, '0.0.0.0', 511, function() {

  // Once the server is listening we automatically open up a browser
  var open = require('open');
  open('http://localhost:' + config.server.listenPort + '/');
});

console.log('Angular App Server - listening on port: ' + config.server.listenPort);
secureServer.listen(config.server.securePort);
console.log('Angular App Server - listening on secure port: ' + config.server.securePort);
