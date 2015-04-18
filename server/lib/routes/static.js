var express = require('express');
var compress = require('compression');

exports.addRoutes = function(app, config) {
  // Serve up the favicon

  //TODO need favicon
  //app.use((require('serve-favicon'))(config.server.distFolder + '/assets/favicon.ico'));

  // First looks for a static file: index.html, css, images, etc.
  app.use(config.server.staticUrl, compress());
  app.use(config.server.staticUrl, express.static(config.server.distFolder));
  app.use(config.server.staticUrl, function(req, res, next) {
    // If we get here then the request for a static file is invalid
    res.send(404);
  });
};
