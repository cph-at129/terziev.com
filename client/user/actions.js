import { CREATE_USER, CREATE_USER_SUCCESS, CREATE_USER_ERROR } from './constants'

export function createUser(payload) {
  return {
    type: CREATE_USER,
    payload,
  };
}

export function createUserSuccess(payload) {
  return {
    type: CREATE_USER_SUCCESS,
    payload,
  };
}

export function createUserError(payload) {
  return {
    type: CREATE_USER_ERROR,
    payload,
  };
}
