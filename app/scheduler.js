/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Schedules bot dispatch queries using cron.
 * Bot dispatch queries are stored in JSON in the same way they are sent to the API
 */
"use strict";
var bot = require('@menome/botframework');
var dispatcher = require('./dispatcher');
var cron = require('cron');
var fs = require('fs');
var config = require('./config');
var jsonfile = require('jsonfile')

module.exports = {
  initialize,
  getSchedule,
  setSchedule
}

var _jobs = []; // Keep our running jobs in here.
var _tasks = [];
var _crontab = {}; // Keep our task definitions in here.

// Initialize the registry. This is done on app startup.
function initialize() {
  // If we don't have a registry file, create a new one.
  // use the default config to make it.
  if(!fs.existsSync(config.get('cronFile'))) {
    bot.logger.info("Registry does not exist. Creating registry.")
    var initialConfig = {tasks:[]};
    fs.writeFileSync(config.get('cronFile'), JSON.stringify(initialConfig));
  }
    
  loadCrontab().then((tab) => {
    schedule(tab)
  });
}

// Loads the crontab JSON file into _crontab.
function loadCrontab() {
  return new Promise(function (resolve, reject) {
    jsonfile.readFile(config.get('cronFile'), function (err, obj) {
      if (err) return reject(err);
      _crontab = obj;
      resolve(obj);
    });
  });
}

function saveCrontab(crontab) {
  return new Promise(function (resolve, reject) {
    jsonfile.writeFile(config.get('cronFile'), crontab, function (err, obj) {
      if (err) return reject(err);

      bot.logger.info("Saved Crontab.")
      resolve(obj);
    });
  });
}

// Makes sure the crontab is scheduled and running.
function schedule(crontab) {
  // Flush entire schedule. TODO: Does this result in memory leaks?
  _jobs.forEach(j=>{
    j.stop()
  });
  _jobs = [];

  crontab.tasks.forEach((task, idx) => {
    _jobs[idx] = new cron.CronJob({
      cronTime: task.cronTime,
      onTick: function() {
        bot.logger.info("Running Job:", task.name || "Untitled Job");

        return dispatcher.dispatch({
          id: task.job.id,
          method: task.job.method,
          path: task.job.path,
          params: task.job.params
        }).then((result) => {
          bot.logger.info(result)
        }).catch((err) => {
          bot.logger.error(result)
        })
      },
      start: !task.disable,
      timeZone: task.timeZone,
    })
  })
}

// Get our crontab.
function getSchedule() {
  return _crontab;
}

// Set our crontab.
function setSchedule(newSched) {
  // TODO: Validation. Please.
  return saveCrontab(crontab)
}