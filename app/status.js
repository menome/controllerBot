/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Gets the status of bots. Keeps a cache and updates regularly.
 */
"use strict";
var rp = require('request-promise');
var registry = require('./registry.js');

module.exports = {
  get
}

function get() {
  var statuses = {};
  return registry.get().then((itms) => {
    var promiseList = [];

    itms.forEach((itm,idx) => {
      promiseList.push(getStatus(itm.address).then((status) => {
        status.name = itm.name
        statuses[idx] = status;
      }))
    })

    return Promise.all(promiseList).then(()=>{return statuses})
  })
}

function getStatus(uri) {
  var options = {
    uri: "http://" + uri+"/status",
    json: true,
  }

  return rp(options);
}