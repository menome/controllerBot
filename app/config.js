/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";
var convict = require('convict');
var fs = require('fs');
var bot = require('@menome/botframework')

// Define a schema
var config = convict({
  port: bot.configSchema.port,
  logging: bot.configSchema.logging
});

// Load from file.
if (fs.existsSync('./config/config.json')) {
  config.loadFile('./config/config.json');
}

// Validate the config.
config.validate({allowed: 'strict'});

module.exports = config;