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

function dispatch({id, operation, body}) {
  return registry.get().then((reg) => {
    var thisOp = reg[id].operations.find((x)=>{return x.name === operation});
    if(!thisOp) return console.error("Operation not found");

    var options = {
      json: true,
      method: thisOp.method,
      uri: "http://"+reg[id].address + thisOp.path
    }

    return rp(options)
  })
}