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
  return new Promise(function(resolve, reject) {
		jsonfile.readFile(config.get('registryFile'), function(err, obj) {
			if (err) {
				reject(err);
			} else {
        list = obj;
				resolve(obj);
			}

		});
  });

}
function saveRegistry(obj){
  return new Promise(function(resolve, reject) {
		jsonfile.writeFile(config.get('registryFile'), obj, function(err, obj) {
			if (err) {
				reject(err);
			} else {
        bot.logger.info("Registry Persisted.")
				resolve();
			}
		});
  });
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
  return new Promise(function(resolve, reject) {
    updateRegistry()
    .then(function(res){
      //bot.logger.info( "RESULT  " + JSON.stringify(res))
      return resolve(res);
    })
  })
}

function updateRegistry(){
  //loadRegistry();
  return new Promise(function(resolve, reject) {
    var promiseList = list.map(function(itm, index){
      //bot.logger.info(JSON.stringify(itm))
      return getEndpoint(itm.Address + "/status")
      .then(function(res){
        list[index]["Status"] = res["state"];
        //bot.logger.info(itm["Status"])
        //bot.logger.info(JSON.stringify(list))
      })
      .catch(function(err) {
        //bot.logger.error(err.toString());
        list[index]["Status"] = "Error Contacting Bot: Bot offline";
      })
    })

    Promise.all(promiseList)
    .then(function(res){
      //bot.logger.info(JSON.stringify(list))
      saveRegistry(list)
      .then(function(){
        resolve(list);
      })
    })
    
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
  bot.logger.info("Getting bot information at: " + options.uri)

  return rp(options)
    .then(function(itm) {
      //bot.logger.info(itm);
      return itm;
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
