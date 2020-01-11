import { fork } from 'redux-saga/effects';
import userSaga from './user/saga';

function* rootSaga () {
  yield [
    fork(userSaga),
  ];
}

export default rootSaga;
