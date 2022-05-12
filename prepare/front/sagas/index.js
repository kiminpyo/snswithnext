import {all, fork} from 'redux-saga/effects';
import axios from 'axios';


import postSaga from './post'
import userSaga from './user'
import signUpSaga from './signup';
/* 모든 주소를 한꺼번에 처리할수 있게 도와준다. */
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials  = true; 

/* genarator */

export default function* rootSaga(){
    yield all([
        fork(postSaga),
        fork(userSaga),
        fork(signUpSaga)
    ])
}