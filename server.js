/**
 * This is an express webserver for serving the build directory.
 * The app must be a pushstate app (For the routes)
 * 
 * This serves the build directory, using index.html as the default page.
 */
var express = require('express');
var app = express();
var port = process.env.PORT || 80;
var http = require('http');
var config  = require('app/config.js');
var controller = require('app/app.js');


app.use(express.static(__dirname + '/build'));
// If they try to grab something we don't have, send them the index page.
// The router will take care of the rest.
app.get('*', function(request, response) {
  return response.sendFile(__dirname + '/build/index.html');
});

//initialize the bot framework and make the registration endpoint 
controller.init();

// Run on HTTP
http.createServer(app).listen(port);
console.log("Listening on " + port);