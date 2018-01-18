var config = require('./config.js');
var bot = require('@menome/botframework');
var jsonfile = require('jsonfile')
var rp = require('request-promise');


module.exports ={
  addNewBot,
  serialize,
  initialize,
  runBot
}
var list = [];

function initialize(){
  list = loadRegistry();
}
function loadRegistry(){
  jsonfile.readFile(config.get('registryFile'), function(err, obj) {
    if(err) return [];
    return list = obj;
  })
}
function saveRegistry(obj){
  jsonfile.writeFile(config.get('registryFile'), obj, function (err) {
    if(err) throw err;    
    bot.logger.info("Registry persisted.")
    return loadRegistry();
  })
}
function addNewBot(botAddress){
  bot.logger.info(botAddress.body.address);
  getBotInfo(botAddress.body.address)
  .then(function(res){
    //bot.logger.info(JSON.stringify(res))
    var botInfo = {
      "Name":res["name"],
      "Address":botAddress.body.address,
      "Description":res["desc"],
      "Status":"Initializing",
      "Operations":res["operations"]
    }
    //bot.logger.info(JSON.stringify(botInfo));
    list.push(botInfo);
    saveRegistry(list);
  });


}

function serialize(){
  updateRegistry()
  return list;
}
function updateRegistry(){
  loadRegistry();
  var promiseList = list.map(function(itm, index){
    //bot.logger.info(JSON.stringify(itm))
    return getEndpoint(itm.Address + "/status")
    .then(function(res){
      list[index]["Status"] = res["state"];
      //bot.logger.info(itm["Status"])
      //bot.logger.info(JSON.stringify(list))
    })
  })

  Promise.all(promiseList)
  .then(function(res){
    //bot.logger.info(JSON.stringify(list))
    saveRegistry(list);
  })
}

function getBotInfo(ip){
  var options = {
    uri: "http://"+ip,
    json: true,

  }

  return rp(options)
    .then(function(itm) {
      //bot.logger.info(itm);
      return itm;
    })
    .catch(function(err) {
      bot.logger.error(err.toString());
    })
}
function getEndpoint(ip){
  var options = {
    uri: "http://"+ip,
    json: true,

  }
  bot.logger.info(options.uri)

  return rp(options)
    .then(function(itm) {
      //bot.logger.info(itm);
      return itm;
    })
    .catch(function(err) {
      bot.logger.error(err.toString());
    })
}
//make this pull the bots info from list once given an ID
//  {
//   "botName":"theLink Data Refinery Service"
//   "operationId":"Status"
//  }
function runBot(runInfo){
  bot.logger.info("Running bots: " + JSON.stringify(runInfo))
  var found = list.find(function(element){
    return element["Name"] === runInfo["botName"];
  })
  var op = found["Operations"].find(function(element){
    return element["name"] === runInfo["operationId"];
  })
  return hitEndpoint(found["Address"] + op["path"], op["method"]);
}

function hitEndpoint(uri, type){
  var options = {
    method: type,
    uri: "http://" + uri,
    json: true,
  }
  return rp(options)
  .then(function(itm) {
    //bot.logger.info(itm);
    return itm;
  })
  .catch(function(err) {
    bot.logger.error(err.toString());
  })
}
