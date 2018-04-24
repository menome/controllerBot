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
  logging: bot.configSchema.logging,
  urlprefix: bot.configSchema.urlprefix,
  registryFile: {
    doc:"The persistent file location for containing regsitered bots",
    format: "*",
    default: "./config/registry.json",
    env: "REGISTRY_FILE_LOCATION"
  },
  defaultRegistries: {
    doc: "The default addresses for the bots we're going to monitor. If there is no registry, start by adding these to the registry.",
    format: Array,
    default: []
  },
  cronFile: {
    doc: "The persistent file location for storing what jobs are scheduled",
    format: "*",
    default: "./config/crontab.json",
    env: "CRON_FILE_LOCATION"
  },
  controllerPassword: {
    doc: "Password that the user will need in order to use the controller bot. Username is admin. Authentication method is HTTP Basic.",
    format: "String",
    default: undefined,
    env: "CONTROLLER_PASSWORD",
    sensitive: true
  }
});

// Load from file.
if (fs.existsSync('./config/config.json')) {
  config.loadFile('./config/config.json');
}

// Validate the config.
config.validate({allowed: 'strict'});

module.exports = config;