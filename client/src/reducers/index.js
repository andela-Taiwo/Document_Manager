import { combineReducers } from 'redux';
import  userInfo  from  './signUpReducer';
import documents from './documentsReducer';
import userLogin from './loginUserReducer';
// import videos from './videoReducer';

// Combines all reducers to a single reducer function
const rootReducer = combineReducers({
  userInfo,
  documents,
  userLogin

});

export default rootReducer;
