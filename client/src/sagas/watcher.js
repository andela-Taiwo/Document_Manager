import { takeLatest } from 'redux-saga/effects';
import { signUpUserSaga } from './SignUpSaga';
import * as types from '../constants/actionTypes';

// Watches for SIGNUP_USER_REQUEST action type asynchronously
export default function* signUpUser() {
  yield takeLatest(types.SIGNUP_USER_SUCCESS, signUpUserSaga);
}
