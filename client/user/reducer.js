import produce from 'immer';
import { CREATE_USER_SUCCESS, CREATE_USER_ERROR } from './constants';
export const initialState = {};

const userReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_USER_SUCCESS:
        draft.user = action.user
        break;
      case CREATE_USER_ERROR:
        draft.error = action.error
        break;
      default:
  }
})

export default userReducer;
