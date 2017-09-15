import initialState from './initialState';
import  * as types from '../constants/actionTypes';

// Handles image related actions
export default function user(state = initialState.userLogin , action) {
  switch (action.type) {
    case types.LOGIN_USER_SUCCESS:
    console.log('login action',action.login);
      return [...state,
        Object.assign({}, action.login)];
    case types.ERROR_MESSAGE:
    // console.log(action.errorMessage);
      return [...state,
      Object.assign({}, action.errorMessage)];
    default:
      return state;
  }
}
