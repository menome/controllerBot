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
const nodeCache = require('node-cache')

module.exports = {
  initialize,
  register,
  get,
  remove
}

// Take 10 minutes to reload the registry cache. This shouldn't refresh much.
// const registry = new NodeCache( { stdTTL: 600 } );

// // When our registry expires, update it.
// registry.on("expired", function( key, value ){
//   if(key === 'registry') updateRegistry();
// });

var registry = [];

// Initialize the registry. This is done on app startup.
function initialize() {
  // If we don't have a registry file, create a new one.
  // use the default config to make it.
  if(!fs.existsSync(config.get('registryFile'))) {
    initialConfig = config.get("defaultRegistries").map((itm,idx) => {
      return {
        id: idx,
        address: itm
      }
    })
    fs.writeFileSync(config.get('registryFile'), JSON.stringify(initialConfig));
    bot.logger.info("Registry does not exist. Creating registry.")
  }
    
  loadRegistry().then(updateRegistry);
}

// Load registry from a file.
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

// Dump registry to a file.
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

// Registers a new bot. Throws an exception with a message if registration failed.
function register(url) {
  var options = {
    uri: "http://"+url,
    json: true,
  }

  var newid = Math.max(registry.map(x=>x.id)) + 1 || 0;

  return rp(options)
    .then(function (res) {
      var botInfo = {
        "id": newid,
        "name": res["name"],
        "desc": res["desc"],
        "operations": res["operations"],
        "address": url,
        "last_update": new Date()
      }
      registry.push(botInfo);
      saveRegistry(registry);
      return "Added " + res["name"]
    })
}

function get({forceRefresh}) {
  if(forceRefresh) return updateRegistry();
  
  return Promise.resolve(registry);
}

function remove(id) {
  var idx = registry.findIndex((x) => {return x.id === id});

  if(idx === -1) return Promise.reject("Could not find bot with ID "+id)
  else {
    registry.splice(idx,1);
    return saveRegistry(registry).then(() => {return "Deleted bot with ID "+id})
  }
}

// Updates the registry by hitting every bot's / endpoint.
function updateRegistry() {
  var promiseList = registry.map(function (itm, index) {
    var options = {
      uri: "http://"+itm.address,
      json: true,
    }
    bot.logger.info("Getting bot information at: " + options.uri)

    //bot.logger.info(JSON.stringify(itm))
    return rp(options)
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
