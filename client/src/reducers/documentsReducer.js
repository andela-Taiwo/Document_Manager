import  initialState  from './initialState';
import  * as types from '../constants/actionTypes';

// Handles image related actions
export default function user(state= initialState.documents, action) {
  switch (action.type) {
    case types.GET_DOCUMENTS_SUCCESS:
    console.log('inside the documents reducer',action);
      return [...state,
        Object.assign({}, action.documents)];
    default:
      return state;
  }
}
