/**
 * Copyright (c) 2018 Menome Technologies Inc.
 * Schedules automatic updates from the server.
 * 
 * Basically just keeps redux state information up to date.
 * Does all the refresh scheduling so you don't have to.
 */
import {changeRegistry, changeBotStatus, changeLoading} from '../redux/Actions';
import WebService from "./webservice";
import store from '../redux/Store';

const refreshIntervalFrequency = 5000; // Refresh every 5 seconds.
var refreshInterval = false;

// Starts the scheduled job of getting info from the API.
export function initialize() {
  // Don't do anything if we've already initialized.
  if(!!refreshInterval) return;

  refreshInterval = setInterval(refreshCall, refreshIntervalFrequency);
  refreshCall()
}

export function stop() {
  clearInterval(refreshInterval);
  refreshInterval = false;
}

// For manually refreshing. Handles interval stuff.
export function refresh(force=false) {
  clearInterval(refreshInterval);
  return refreshCall(force).then((result) => {
    refreshInterval = setInterval(refreshCall, refreshIntervalFrequency);
  }).catch((err) => {
    refreshInterval = setInterval(refreshCall, refreshIntervalFrequency);
  });
}

// Refreshes the data from the API.
function refreshCall(force=false) {
  var promises = [];
  store.dispatch(changeLoading(true));
  
  promises.push(
    WebService.get('/api/registry', {forcerefresh: force}).then((result) => {
      return store.dispatch(changeRegistry(result.body.data));  
    }).catch((err) => {
      store.dispatch(changeLoading(false));
      return console.log(err);
    })
  )

  promises.push(
    WebService.get('/api/botstatus', {forcerefresh: force}).then((result) => {
      return store.dispatch(changeBotStatus(result.body.data));  
    }).catch((err) => {
      store.dispatch(changeLoading(false));
      return console.log(err);
    })
  )

  return Promise.all(promises);
}