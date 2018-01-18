/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Bot entrypoint. Initialize, configure, create HTTP endpoints, etc.
 */
"use strict";
var bot = require('@menome/botframework')
var config = require('./config.js');
var registry = require('./registry.js');

// We only need to do this once. Bot is a singleton.
bot.configure({
  name: "Bot Manager",
  desc: "Hosts a registration endpoint for bots to connect to and a react dashboard for user interaction.",
  logging: config.get('logging'),
  port: config.get('port'),
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
  registry.addNewBot(req);
  res.send(
    bot.responseWrapper({
      status: "success",
      message: "Bot added to Registry"
    })
  )
});

//register an endpoint to pull bot information
bot.registerEndpoint({
  "name": "Serialize",
  "path": "/serialize",
  "method": "GET",
  "desc": "Gets JSON detailing status of all bots"
}, function(req,res) {
  registry.serialize()
  .then(function(response){
    res.send(
      bot.responseWrapper({
        status: "success",
        message: "Obtained registry",
        registry: response
      })
    )
  })

});

//register an endpoint to start a bots operation
//  POST
//  application/json
//  {
//   "botName":"theLink Data Refinery Service"
//   "operationId":"Status"
//  }
bot.registerEndpoint({
  "name": "Start",
  "path": "/start",
  "method": "POST",
  "desc": "Given a bots id and operation, start that bots task"
}, function(req,res) {
  registry.runBot(req.body)
  .then(function(response){
    res.send(
      bot.responseWrapper({
        status: "success",
        message: response
      })
    )
  });
});

registry.initialize();
// Start the bot.
bot.start();
bot.changeState({state: "idle"})
