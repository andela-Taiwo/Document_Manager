import axios from 'axios';
import * as requestAction from '../actions/SignUpAction';
import * as getDocumentsAction from '../actions/getAllDocuments';

export function registerUser(user) {
  // console.log('inside the api datat', user.userName);
  const SIGNUP_ENDPOINT = 'http://localhost:3000/api/v1/users'
    return (dispatch) => {
      console.log('inside the api datat', user.userName);
        return axios({
          method: 'POST',
          url:SIGNUP_ENDPOINT,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Accept': 'application/json',
              'Content-Type': 'application/json',

            },
          data:
          {email: user.email,
          password: user.password,
          userName: user.userName
        }

        })
        .then((items) => { dispatch(requestAction.SignUp(items))
        })
        .catch((error) => {
          throw(error.response)
        });
    };
}

export function loginUser(user) {
  // console.log('inside the api datat', user.userName);
  const LOGIN_ENDPOINT = 'http://localhost:3000/api/v1/users/login'
    return (dispatch) => {
      console.log('inside the api datat', user.email);
        return axios({
          method: 'POST',
          url:LOGIN_ENDPOINT,
          headers: {
              'Access-Control-Allow-Origin': '*',
              'Accept': 'application/json',
              'Content-Type': 'application/json',

            },
          data:
          {email: user.email,
          password: user.password,
        }

        })
        .then((items) => { dispatch(requestAction.Login(items))
        })
        .catch((error) => {
          console.log(('inside the login api calll',error.response))
          throw(error.response)
        });
    };
}

export function getAllDocuments() {
  // console.log('inside the api datat', user.userName);
  const DOCUMENTS_ENDPOINT = 'http://localhost:3000/api/v1/documents'
    return (dispatch) => {
      console.log('inside the documents');
      axios.defaults
      .headers.common.Authorization = localStorage.getItem('userToken');
        return axios({
          method: 'get',
          url:DOCUMENTS_ENDPOINT,
        })
        .then((items) => { dispatch(getDocumentsAction.getDocuments(items))
        })
        .catch((error) => {
          throw(error.response)
        });
    };
}
