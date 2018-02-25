/**
 * Copyright (C) 2017 Menome Technologies Inc.
 * 
 * Holds Action constants and creators for the bot controller.
 * Any sort of state change for the app is done through one of these actions.
 * http://redux.js.org/docs/basics/
 */

// Changes the status object.
export const CHANGE_BOT_STATUS = 'CHANGE_BOT_STATUS'
export function changeBotStatus(status) {
  return { type: CHANGE_BOT_STATUS, status}
}

export const CHANGE_REGISTRY = 'CHANGE_REGISTRY'
export function changeRegistry(registry) {
  return { type: CHANGE_REGISTRY, registry}
}

// Changes the loading state.
export const CHANGE_LOADING = 'CHANGE_LOADING'
export function changeLoading(loading) {
  return { type: CHANGE_LOADING, loading}
}