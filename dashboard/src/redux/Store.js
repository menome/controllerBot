/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Redux Store
 */
import { createStore } from 'redux'
import appReducers from './Reducers'

// Create our redux store. Keeps track of entire app state.
let store = createStore(
  appReducers,
  undefined
);

export default store;