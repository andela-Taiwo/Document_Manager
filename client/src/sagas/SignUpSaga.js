import { put, call } from 'redux-saga/effects';
import { registerUser } from '../Api/docManagerAPI';
import * as types from '../constants/actionTypes';

// Responsible for searching media library, making calls to the API
// and instructing the redux-saga middle ware on the next line of action,
// for success or failure operation.
export function* signUpUserSaga({ payload }) {
  try {
    const user = yield call(registerUser, payload);
    // const images = yield call(flickrImages, payload);
    yield [
      put({ type: types.SIGNUP_USER_SUCCESS, user }),
      // put({ type: types.SELECTED_VIDEO, video: videos[0] }),
      // put({ type: types.FLICKR_IMAGES_SUCCESS, images }),
      // put({ type: types.SELECTED_IMAGE, image: images[0] })
    ];
  } catch (error) {
    yield put({ type: 'SIGNUP_USER_ERROR', error });
  }
}
