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

  refreshInterval = setInterval(refresh, refreshIntervalFrequency);
  refresh()
}

export function stop() {
  clearInterval(refreshInterval);
  refreshInterval = false;
}

// Refreshes the data from the API.
function refresh(force=false) {
  store.dispatch(changeLoading(true));
  WebService.get('/api/registry', {forcerefresh: force}).then((result) => {
    return store.dispatch(changeRegistry(result.body.data));  
  }).catch((err) => {
    store.dispatch(changeLoading(false));
    return console.log(err);
  });

  WebService.get('/api/botstatus', {forcerefresh: force}).then((result) => {
    return store.dispatch(changeBotStatus(result.body.data));  
  }).catch((err) => {
    store.dispatch(changeLoading(false));
    return console.log(err);
  });
}