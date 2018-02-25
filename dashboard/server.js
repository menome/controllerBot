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

// For getting the URL of the API
var api_url = process.env.API_URL || "http://localhost:3051/";
app.get('/apiurl.js', function (req, res, next) {
  res.setHeader('Content-Type', 'application/javascript');
  return res.send("window.apiUrl='"+api_url+"';");
});

app.use(express.static(__dirname + '/build'));

// If they try to grab something we don't have, send them the index page.
// The router will take care of the rest.
app.get('*', function(request, response) {
  return response.sendFile(__dirname + '/build/index.html');
});

// Run on HTTP
http.createServer(app).listen(port);
console.log("Listening on " + port);