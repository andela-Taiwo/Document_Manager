import initialState from './initialState';
import  * as types from '../constants/actionTypes';

// Handles image related actions
export default function userInfo(state = [], action) {
  switch (action.type) {
    case types.SIGNUP_USER_SUCCESS:
    console.log('sign up action',action.signUp);
      return [...state,
        Object.assign({}, action.signUp)];
    case types.ERROR_MESSAGE:
    // console.log(action.errorMessage);
      return [...state,
      Object.assign({}, action.errorMessage)];
    default:
      return state;
  }
}
