var config = require('./config.js');
var bot = require('@menome/botframework');
var jsonfile = require('jsonfile')
var rp = require('request-promise');


module.exports ={
  addNewBot,
  serialize,
  initialize,
  runBots
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
  })
}
function addNewBot(botAddress){
  bot.logger.info(botAddress.body.address);
  getBotInfo(botAddress.body.address)
  .then(function(res){
    //bot.logger.info(JSON.stringify(res))
    var botInfo = {
      "Name":res["name"],
      "Description":res["desc"],
      "Operations":res["operations"]
    }
    bot.logger.info(JSON.stringify(botInfo));
    list.push(botInfo);
    saveRegistry(list);
  });


}

function serialize(){
  loadRegistry();
  //bot.logger.info("eh" + list);
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
    bot.logger.info("hi" + itms);
  });
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
