/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Store Redux Reducers in this file.
 * Note: For reducers to properly fire update events, 
 * the state object returned must be ENTIRELY NEW.
 * (Meaning: A completely new object reference)
 */
import { combineReducers } from 'redux';
import * as actions from './Actions';

const appReducers = combineReducers({
  botstatus,
  registry,
  loadingState,
  lastUpdateTime
})

// Change the user. Hold the user object, and also store whether or not we're actively authenticated.
// Before we change this state, 'checked' is false. Shows that we don't know if we're authenticated or not because we haven't yet made the call to check.
function botstatus(state = [], action) {
  switch(action.type) {
    case actions.CHANGE_BOT_STATUS: return action.status;
    default: return state;
  }
}

function registry(state = [], action) {
  switch(action.type) {
    case actions.CHANGE_REGISTRY: return action.registry;
    default: return state;
  }
}

function loadingState(state = false, action) {
  switch(action.type) {
    case actions.CHANGE_LOADING: return action.loading;
    case actions.CHANGE_BOT_STATUS: return false;
    case actions.CHANGE_REGISTRY: return false;
    default: return state;
  }
}

// Change the timestamp of the last update. -1 is never.
function lastUpdateTime(state = -1, action) {
  switch(action.type) {
    case actions.CHANGE_REGISTRY:
    case actions.CHANGE_BOT_STATUS:
      return Date.now();
    default: return state;
  }
}

export default appReducers