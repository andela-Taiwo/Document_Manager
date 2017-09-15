import * as types from '../constants/actionTypes';

export const getUsers = (users) => ({
  type: types.GET_USERS_SUCCESS,
  users
});
