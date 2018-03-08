/**
 * Copyright (c) 2018 Menome Technologies Inc.
 * Sends requests to the webservice.
 */
// import {changeRegistry, changeBotStatus, changeLoading} from '../redux/Actions';
import WebService from "./webservice";
// import store from '../redux/Store';

// Starts the scheduled job of getting info from the API.
export function dispatchFunc({id, method, path, params}) {
  var body = { id, method, path, params }
  return WebService.post('/api/dispatch', body).then((result) => {
    return result;
  }).catch((err) => {
    console.log(err)
    return err;
  })
}

export function deleteBot({id}) {
  var body = { id }
  return WebService.delete('/api/bot', body).then((result) => {
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
    return result;
  })
}