import * as types from '../constants/actionTypes';
import axios from 'axios';

//
export const SignUp = (signUp) => ({
  type: types.SIGNUP_USER_SUCCESS,
  signUp
});

export const Login = (login) => ({
  type: types.LOGIN_USER_SUCCESS,
  login
});


export const errorMessage = (errors) => ({
  type: types.ERROR_MESSAGE,
  errors
})
