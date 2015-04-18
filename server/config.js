var path = require('path');

module.exports = {
  mongo: {

    // The base url of the MongoLab DB server
    dbUrl: 'https://api.mongolab.com/api/1',

    // Our MongoLab API key
    apiKey: '4fb51e55e4b02e56a67b0b66'
  },
  security: {

    // The name of database that contains the security information
    dbName: 'ascrum',

    // The name of the collection contains user information
    usersCollection: 'users'
  },
  server: {

    // The port on which the server is to listen (means that the app is at http://localhost:3000 for instance)
    listenPort: 3000,

    // The HTTPS port on which the server is to listen (means that the app is at https://localhost:8433 for instance)
    securePort: 8433,

    // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    distFolder: path.resolve(__dirname, '../client'),

    // The base url from which we serve static files (such as js, css and images)
    staticUrl: '/static',

    // The secret for encrypting the cookie
    cookieSecret: 'angular-app'
  }
};
