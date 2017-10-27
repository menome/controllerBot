var config = require('./config.js');
var bot = require('@menome/botframework');



module.exports ={
    addNewBot,
    serialize,
    initialize,
    runBots
}
var list = [];
function initialize(){
    var info = {
        "Name":"Bot Controller",
        "StatusEndpoint":"",
        "ActionEndpoint":"",
        "Description":"Bot controller, manages registry of the multi-agent system",
        "BotStatus":"Monitoring"
    }
    bot.logger.info("Controller Bot initialized");
    list.push(info);
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
}

function serialize(){
    return list;
}

function runBots(bots){
    bots.foreach(function(bot){
        
    })
}

function putEndpoint(uri){
    var options = {
        uri: uri,
        json: true,
        headers: {

        }
      }
}