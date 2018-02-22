/** 
 * Copyright (c) 2018 Menome Technologies Inc.
 * 
 * Methods for interacting with the bot registry.
 * The bot registry contains all bots that the controller is aware of.
 * It keeps track of their name, description, and methods.
 * Ephemeral stuff like their current status is cached elsewhere.
*/
var config = require('./config.js');
var bot = require('@menome/botframework');
var jsonfile = require('jsonfile')
var rp = require('request-promise');
var fs = require('fs');

module.exports = {
  initialize,
  register,
  get
}

var registry = [];

function initialize() {
  if(!fs.existsSync(config.get('registryFile'))) {
    fs.writeFileSync(config.get('registryFile'), JSON.stringify([]));
    bot.logger.info("Registry does not exist. Creating registry.")
  }
    
  registry = loadRegistry();
}

function loadRegistry() {
  return new Promise(function (resolve, reject) {
    jsonfile.readFile(config.get('registryFile'), function (err, obj) {
      if (err) {
        reject(err);
      } else {
        registry = obj;
        resolve(obj);
      }
    });
  });
}

function saveRegistry(obj) {
  return new Promise(function (resolve, reject) {
    jsonfile.writeFile(config.get('registryFile'), obj, function (err, obj) {
      if (err) {
        reject(err);
      } else {
        bot.logger.info("Registry Persisted.")
        resolve();
      }
    });
  });
}

function register(url) {
  return getBotInfo(url)
    .then(function (res) {
      //bot.logger.info(JSON.stringify(res))
      var botInfo = {
        "id": registry.length,
        "name": res["name"],
        "desc": res["desc"],
        "operations": res["operations"],
        "address": url,
        "last_update": new Date()
      }
      //bot.logger.info(JSON.stringify(botInfo));
      registry.push(botInfo);
      saveRegistry(registry);
      return "Added " + res["name"]
    })
}

function get() {
  return updateRegistry()
}

function updateRegistry() {
  var promiseList = registry.map(function (itm, index) {
    //bot.logger.info(JSON.stringify(itm))
    return getEndpoint(itm.address)
      .then(function (res) {
        registry[index]["desc"] = res["desc"];
        registry[index]["name"] = res["name"];
        registry[index]["operations"] = res["operations"];
        registry[index]["last_update"] = new Date();
        delete registry[index]["last_update_failed"];
      })
      .catch(function (err) {
        registry[index]["last_update"] = new Date();
        registry[index]["last_update_failed"] = true;
      })
  })

  return Promise.all(promiseList).then(function (res) {
    return saveRegistry(registry).then(()=>{return registry})
  })
}

function getBotInfo(ip) {
  var options = {
    uri: "http://" + ip,
    json: true,
  }

  return rp(options);
}

function getEndpoint(ip) {
  var options = {
    uri: "http://" + ip,
    json: true,
  }
  bot.logger.info("Getting bot information at: " + options.uri)

  return rp(options)
    .then(function (itm) {
      return itm;
    })
}
/*
//make this pull the bots info from list once given an ID
//  {
//   "botName":"theLink Data Refinery Service"
//   "operationId":"Status"
//  }
function runBot(runInfo) {
  bot.logger.info("Running bots: " + JSON.stringify(runInfo))
  var found = registry.find(function (element) {
    return element["Name"] === runInfo["botName"];
  })
  var op = found["Operations"].find(function (element) {
    return element["name"] === runInfo["operationId"];
  })
  return hitEndpoint(found["Address"] + op["path"], op["method"]);
}

function hitEndpoint(uri, type) {
  var options = {
    method: type,
    uri: "http://" + uri,
    json: true,
  }
  return rp(options)
    .then(function (itm) {
      //bot.logger.info(itm);
      return itm;
    })
    .catch(function (err) {
      bot.logger.error(err.toString());
    })
}*/