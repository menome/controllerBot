/**
 * Copyright (c) 2018 Menome Technologies Inc.
 * Sends requests to the webservice.
 */
// import {changeRegistry, changeBotStatus, changeLoading} from '../redux/Actions';
import WebService from "./webservice";
import {refresh} from './telemetry'
// import store from '../redux/Store';

// Starts the scheduled job of getting info from the API.
export function dispatchFunc({id, method, path, params, body}) {
  var dispatchBody = { id, method, path, params, body }
  return WebService.post('/api/dispatch', dispatchBody).then((result) => {
    return result;
  }).catch((err) => {
    console.log(err)
    return err;
  })
}

export function deleteBot({id}) {
  var body = { id }
  return WebService.delete('/api/bot', body).then((result) => {
    refresh(true);
    return result;
  }).catch((err) => {
    console.log(err)
    return err;
  })
}

export function addBot({address}) {
  var body = { 
    address: address
  }
  
  return WebService.post('/api/register', body).then((result) => {
    refresh(true);
    return result;
  })
}

export function deleteTask({id}) {
  var params = { id }
  return WebService.delete('/api/schedule', params).then((result) => {
    refresh(true);
    return result;
  }).catch((err) => {
    console.log(err)
    return err;
  })
}

export function runTask({id}) {
  var params = { id }
  return WebService.post('/api/schedule/run', {}, params).then((result) => {
    refresh(true);
    return result;
  }).catch((err) => {
    console.log(err)
    return err;
  })
}

export function addTask(cronJob) {
  return WebService.post('/api/schedule', cronJob).then((result) => {
    refresh(true);
    return result;
  }).catch((err) => {
    console.log(err)
    return err;
  })
}