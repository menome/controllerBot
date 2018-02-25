/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Bot entrypoint. Initialize, configure, create HTTP endpoints, etc.
 */
"use strict";
var bot = require('@menome/botframework')
var config = require('./config.js');
var registry = require('./registry.js');
var status = require('./status.js');
var dispatcher = require('./dispatcher.js');

// We only need to do this once. Bot is a singleton.
bot.configure({
  name: "Bot Manager",
  desc: "Hosts a registration endpoint for bots to connect to and a react dashboard for user interaction.",
  logging: config.get('logging'),
  port: config.get('port'),
});

// This adds headers for CORS.
bot.web.use(function (req, res, next) {
  // var thisOrigin = req.get("Origin");
  // if(thisOrigin && conf.allowedOrigins.indexOf(req.get("Origin") !== -1))
  res.setHeader('Access-Control-Allow-Origin', "http://localhost:3001");

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  if(req.method === 'OPTIONS')
    res.sendStatus(200);
  else
    next();
});

// Register our add bot endpoint.
//  POST
//  application/json
//  {
//   "address":"localhost:3009"
//  }
bot.registerEndpoint({
  "name": "Register",
  "path": "/register",
  "method": "POST",
  "desc": "Add a new bot to the managment registry"
}, function(req,res) {
  return registry.register(req.body.address).then((result) => {
    res.send(
      bot.responseWrapper({
        status: "success",
        message: result
      })
    )
  }).catch(err => {
    res.status(400).send(bot.responseWrapper({
      status: "failure",
      message: err.toString()
    }))
  });
});

// Register our add bot endpoint.
//  DELETE ?id=<number>
bot.registerEndpoint({
  "name": "Delete Bot",
  "path": "/bot",
  "method": "DELETE",
  "desc": "Remove a bot by its ID",
  "params": [
    {
      "name": "ID",
      "desc": "The ID of the bot entry to remove from the controller list"
    }
  ]
}, function(req,res) {
  var idNum = parseInt(req.query.id);
  if(isNaN(idNum)) return res.json(
    bot.responseWrapper({ status: "failure", message: "Not a valid bot ID." })
  )

  return registry.remove(idNum).then((msg) => {
    return res.json(
      bot.responseWrapper({
        status: "success",
        message: msg
      })
    )
  }).catch((err) => {
    return res.json(
      bot.responseWrapper({
        status: "failure",
        message: err
      })
    )
  })
});

//register an endpoint to pull bot information
bot.registerEndpoint({
  "name": "Get Registry",
  "path": "/registry",
  "method": "GET",
  "desc": "Gets JSON detailing all known bots"
}, function(req,res) {
  registry.get()
  .then(function(response){
    res.send(
      bot.responseWrapper({
        status: "success",
        message: "Obtained registry",
        data: response
      })
    )
  })
});

bot.registerEndpoint({
  "name": "Get Status of all Bots",
  "path": "/botstatus",
  "method": "GET",
  "desc": "Gets JSON detailing the current status of bots"
}, function(req,res) {
  return status.get().then((statusObj) => {
    return res.send(
      bot.responseWrapper({
        status: "success",
        message: "Obtained Bot Status",
        data: statusObj
      })
    )
  })
})

//register an endpoint to start a bots operation
//  POST
//  application/json
//  {
//   "id": 0,
//   "path":"/sync",
//   "method":"POST",
//   "params": {"key": "val"}
//  }
bot.registerEndpoint({
  "name": "Dispatch",
  "path": "/dispatch",
  "method": "POST",
  "desc": "Run a bot's operations."
}, function(req,res) {
  dispatcher.dispatch({
    id: req.body.id, 
    path: req.body.path,
    method: req.body.method,
    params: req.body.params,
  }).then((result) => {
    return res.send(
      bot.responseWrapper({
        status: "success",
        message: "Operation Dispatched",
        data: result
      })
    )
  }).catch((err) => {
    return res.send(
      bot.responseWrapper({
        status: "failure",
        message: err.toString()
      })
    )
  })
});

// Start the bot.
registry.initialize();
bot.start();
bot.changeState({state: "idle"})
