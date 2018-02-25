/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Dispatches functions to bots.
 */
"use strict";

var rp = require('request-promise');
var registry = require('./registry.js');

module.exports = {
  dispatch
}

function dispatch({id, path, method, params}) {
  return registry.get().then((reg) => {
    var thisBot = reg.find(x=>x.id === id);
    if(!thisBot) throw new Error("No bot with this ID found");
    var thisOp = thisBot.operations.find((x)=>{return (x.method === method && x.path === path) });
    if(!thisOp) throw new Error("Operation not found");

    var options = {
      json: true,
      method: thisOp.method,
      qs: params,
      uri: "http://"+thisBot.address + thisOp.path
    }

    return rp(options)
  })
}