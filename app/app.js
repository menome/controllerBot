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
var express = require("express");
var scheduler = require('./scheduler')
var schema = require('./schema')

// We only need to do this once. Bot is a singleton.
bot.configure({
  name: "Bot Manager",
  desc: "Hosts a registration endpoint for bots to connect to and a react dashboard for user interaction.",
  logging: config.get('logging'),
  port: config.get('port'),
  urlprefix: config.get('urlprefix'),
});

// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  bot.web.use(express.static("../dashboard/build"));
}

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
  "desc": "Add a new bot to the managment registry. Specify address in body.",
  "body": true
}, function(req,res) {
  if(!req.body || !req.body.address)
    return res.send(bot.responseWrapper({
      status: "failure",
      message: "Specify an address field in the JSON body."
    }))

  return registry.register(req.body.address).then((result) => {
    return res.send(
      bot.responseWrapper({
        status: "success",
        message: result
      })
    )
  }).catch(err => {
    return res.status(400).send(bot.responseWrapper({
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
      "name": "id",
      "desc": "The ID of the bot entry to remove from the controller list"
    }
  ]
}, function(req,res) {
  var idNum = parseInt(req.query.id);
  if(isNaN(idNum)) return res.json(
    bot.responseWrapper({ status: "failure", message: "Not a valid bot ID." })
  )

  return registry.remove(idNum).then((msg) => {
    // Delete all relevant scheduled tasks.
    scheduler.deleteTasksForBot(idNum);
    return res.json(
      bot.responseWrapper({
        status: "success",
        message: msg
      })
    )
  }).catch((err) => {
    return res.status(400).json(
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
  "desc": "Gets JSON detailing all known bots",
  "params": [
    {
      "name": "forcerefresh",
      "desc": "If true, force a refresh of the registry before returning. Do not use the cache."
    }
  ]
}, function(req,res) {
  var forceRefresh = req.query.forcerefresh === "true";

  registry.get({forceRefresh}).then(function(response){
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
  "desc": "Gets JSON detailing the current status of bots",
  "params": [
    {
      "name": "forcerefresh",
      "desc": "If true, force a refresh of the bot statuses before returning. Do not use the cache."
    }
  ]
}, function(req,res) {
  var forceRefresh = req.query.forcerefresh === "true";

  return status.get({forceRefresh}).then((statusObj) => {
    return res.send(
      bot.responseWrapper({
        status: "success",
        message: "Obtained Bot Status",
        data: statusObj
      })
    )
  })
})

//register an endpoint to start a bot's operation
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
  "desc": "Run a bot's operations.",
  "body": true
}, function(req,res) {
  var errors = schema.validate("dispatchTask",req.body);
  if(!!errors)
    return res.status(400).send(bot.responseWrapper({
      status: "failure",
      message: "Invalid dispatch call.",
      data: errors
    }))

  dispatcher.dispatch({
    id: req.body.id, 
    path: req.body.path,
    method: req.body.method,
    params: req.body.params,
    body: req.body.body
  }).then((result) => {
    return res.send(
      bot.responseWrapper({
        status: "success",
        message: "Operation Dispatched",
        data: result
      })
    )
  }).catch((err) => {
    return res.status(500).send(
      bot.responseWrapper({
        status: "failure",
        message: err.body || err.toString()
      })
    )
  })
});

// Start the bot.
registry.initialize();
scheduler.initialize();
bot.start();
bot.changeState({state: "idle"})
