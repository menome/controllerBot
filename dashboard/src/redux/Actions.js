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

//Change whether or not the modal is open.
export const CHANGE_MODAL = 'CHANGE_MODAL'
export function changeModal({open, title, body}) {
  return { type: CHANGE_MODAL, open, title, body}
}

//Change whether or not the modal is open.
export const CHANGE_SCHEDULE = 'CHANGE_SCHEDULE'
export function changeSchedule(schedule) {
  return { type: CHANGE_SCHEDULE, schedule}
}
