/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Dispatches functions to bots.
 */
"use strict";

var rp = require('request-promise');
var registry = require('./registry');

module.exports = {
  dispatch
}

function dispatch({ id, path, method, params, body }) {
  return registry.get({ forceRefresh: false }).then((reg) => {
    var thisBot = reg.find(x => x.id === id);
    if (!thisBot) throw new Error("No bot with this ID found");
    var thisOp = thisBot.operations.find((x) => { return (x.method === method && x.path === path) });
    if (!thisOp) throw new Error("Operation not found");

    if (params) {      
      params = JSON.parse(JSON.stringify(params).replace(/@\{(\w+)\}/g, function (match, group) {
        if (group === 'todayShortDate') {
          var datetime = new Date();
          return datetime.toISOString().slice(0, 10);
        }
      }))      
    }

    var options = {
      json: true,
      method: thisOp.method,
      qs: params,
      uri: "http://" + thisBot.address + thisOp.path,
      body: body
    }

    return rp(options)
  })
}