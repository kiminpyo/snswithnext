import {all, fork, take, call, put, takeEvery,takeLatest, delay} from 'redux-saga/effects'
import axios from 'axios';
import {LOG_IN_SUCCESS, LOG_IN_REQUEST,LOG_IN_FAILURE,
        LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
        SIGN_UP_REQUEST, SIGN_UP_SUCCESS,SIGN_UP_FAILURE} from '../reducers/user'



    function signUpAPI(data){
            /* data에는 email pw nick이 있다 */
         
   return axios.post('/user/signup', data)
}
function* signUp(action){
    try{

        const result = yield call(signUpAPI, action.data)
        console.log(result)
        yield put({
            type: SIGN_UP_SUCCESS,     
        })
       }catch(err){
        yield put({
            type: SIGN_UP_FAILURE,
            error: err.response.data
        })
       }
}


function* watchSignUp() {
    yield takeLatest('SIGN_UP_REQUEST', signUp)
}

export default function* signUpSaga() {
    yield all([
        fork(watchSignUp)
       
    ])
}
