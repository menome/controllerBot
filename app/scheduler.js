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
  setSchedule,
  addTask,
  deleteTask,
}

var _jobs = []; // Keep our running jobs in here.
var _crontab = {}; // Keep our task definitions in here.

// Initialize the registry. This is done on app startup.
function initialize() {
  // Initialize our bot endpoints first.
  initializeEndpoints();
  // If we don't have a registry file, create a new one.
  // use the default config to make it.
  if(!fs.existsSync(config.get('cronFile'))) {
    bot.logger.info("Registry does not exist. Creating registry.")
    var initialConfig = {tasks:{}};
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
      resolve(crontab);
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

  Object.keys(crontab.tasks).forEach((key) => {
    var task = crontab.tasks[key];
    _jobs[key] = new cron.CronJob({
      cronTime: task.cronTime,
      onTick: function() {
        bot.logger.info("Running Job:", task.name || "Untitled Job");

        return dispatcher.dispatch({
          id: task.job.id,
          method: task.job.method,
          path: task.job.path,
          params: task.job.params
        }).then((result) => {
          bot.logger.info("Job Completed:", task.name || "Untitled Job");
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
  return saveCrontab(newSched).then((crontab)=>{return schedule(crontab)})
}

function addTask(task) {
  // Each task needs a unique key.
  var newKey = 0;
  Object.keys(_crontab.tasks).forEach((key) => {
    if(parseInt(key) >= newKey)
      newKey = parseInt(key)+1;
  })

  // TODO: Schema Validation. Please.
  _crontab.tasks[newKey] = task;
  return saveCrontab(_crontab).then((crontab)=>{
    schedule(crontab)
    return newKey
  })
}

function deleteTask(taskid) {
  //TODO: Bounds check and stuff.
  delete _crontab.tasks[taskid.toString()];
  return saveCrontab(_crontab).then((crontab)=>{return schedule(crontab)})
}

function runTask(taskid) {
  //TODO: Bounds check and stuff.
  var task = _jobs[taskid]
  return task._callbacks[0]();
}

function initializeEndpoints() {
  bot.registerEndpoint({
    "name": "Get Cron Schedule",
    "path": "/schedule",
    "method": "GET",
    "desc": "Gets a list of the controllerBot's scheduled tasks."
  }, function(req,res) {
    return res.send(bot.responseWrapper({
      status: "success",
      message: "Obtained schedule",
      data: getSchedule()
    }))
  });

  bot.registerEndpoint({
    "name": "Add Scheduled Task",
    "path": "/schedule",
    "method": "POST",
    "desc": "Add a job to the Cron schedule"
  }, function(req,res) {
    return addTask(req.body).then((id) => {
      return res.json(
        bot.responseWrapper({
          status: "success",
          message: "Added Task with ID: "+id
        })
      )
    }).catch((err) => {
      return res.json(
        bot.responseWrapper({
          status: "failure",
          message: err.toString()
        })
      )
    });
  });

  //  DELETE ?id=<number>
  bot.registerEndpoint({
    "name": "Delete Scheduled Task",
    "path": "/schedule",
    "method": "DELETE",
    "desc": "Remove a task by its ID",
    "params": [
      {
        "name": "id",
        "desc": "The ID of the task to delete"
      }
    ]
  }, function(req,res) {
    var idNum = parseInt(req.query.id);
    if(isNaN(idNum)) return res.json(
      bot.responseWrapper({ status: "failure", message: "Not a valid task ID." })
    )

    return deleteTask(idNum).then(() => {
      return res.json(
        bot.responseWrapper({
          status: "success",
          message: "Deleted Task with ID "+idNum
        })
      )
    }).catch((err) => {
      return res.json(
        bot.responseWrapper({
          status: "failure",
          message: err.toString()
        })
      )
    });
  });

  //  Run a scheduled task.
  bot.registerEndpoint({
    "name": "Run Scheduled Task",
    "path": "/schedule/run",
    "method": "POST",
    "desc": "Run a task by its ID",
    "params": [
      {
        "name": "id",
        "desc": "The ID of the task to run"
      }
    ]
  }, function(req,res) {
    var idNum = parseInt(req.query.id);
    if(isNaN(idNum)) return res.json(
      bot.responseWrapper({ status: "failure", message: "Not a valid task ID." })
    )

    return runTask(idNum).then(() => {
      return res.json(
        bot.responseWrapper({
          status: "success",
          message: "Task Executed Successfully"
        })
      )
    }).catch((err) => {
      return res.json(
        bot.responseWrapper({
          status: "failure",
          message: err.toString()
        })
      )
    });
  });
}