var config = require('./config.js');
var bot = require('@menome/botframework');
var jsonfile = require('jsonfile')


module.exports ={
  addNewBot,
  serialize,
  initialize,
  runBots
}
var list = {};
function initialize(){
  list = loadRegistry()
}
function loadRegistry(){
  jsonfile.readFile(config.get('registryFile'), function(err, obj) {
    if(err) throw err;
    return obj;
  })
}
function saveRegistry(obj){
  jsonfile.writeFile(config.get('registryFile'), obj, function (err) {
    if(err) throw err;    
    bot.logger.info("Registry persisted.")
  })
}
function addNewBot(botInfo){
  bot.logger.info(JSON.stringify(botInfo.body))
  var info = {
    "Name":botInfo.body.Name,
    "StatusEndpoint":botInfo.body.StatusEndpoint,
    "ActionEndpoint":botInfo.body.ActionEndpoint,
    "Description":botInfo.body.Description,
    "BotStatus":"initializing"
  }
  list.push(info);
  saveRegistry(list);
}

function serialize(){
  return list;
}

function runBots(bots){
  bots.foreach(function(bot){
    postEndpoint(bot.ActionEndpoint)
  })
}

function postEndpoint(uri){
  var options = {
    uri: uri,
    json: true,
    headers: {

    }
  }
  rp(options)
  .then(function(itms) {
    bot.logger.info(itms);
  });
}