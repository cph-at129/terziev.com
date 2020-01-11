import { put, takeLatest, all } from 'redux-saga/effects';
import { CREATE_USER } from './constants'
import { createUserSuccess, createUserError } from './actions'
import { create } from './api-user';

function* createUser(action) {
  try {
    create(action.payload)
      .then(res => res.json())
      .then(user => {
        createUserSuccess(user);
      })
  } catch(error) {
    yield put(createUserError({ error }));
  }
}

function* createUserActionWatcher() {
  yield takeLatest(CREATE_USER, createUser);
}

export default function* userSaga() {
  yield all([
    createUserActionWatcher(),
  ]);
}
