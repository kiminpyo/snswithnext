import {all, fork, take, call, put, takeEvery,takeLatest, delay} from 'redux-saga/effects'

import {LOG_IN_SUCCESS, LOG_IN_REQUEST,LOG_IN_FAILURE,
        LOG_OUT_REQUEST, LOG_OUT_SUCCESS, LOG_OUT_FAILURE,
        SIGN_UP_REQUEST, SIGN_UP_SUCCESS,SIGN_UP_FAILURE, LOAD_MY_INFO_SUCCESS, LOAD_MY_INFO_FAILURE, CHANGE_NICKNAME_SUCCESS, CHANGE_NICKNAME_FAILURE, FOLLOW_REQUEST, FOLLOW_FAILURE, UNFOLLOW_SUCCESS, UNFOLLOW_FAILURE, LOAD_FOLLOWINGS_REQUEST, LOAD_FOLLOWINGS_FAILURE, LOAD_FOLLOWERS_SUCCESS, LOAD_FOLLOWERS_FAILURE, REMOVE_FOLLOWER_SUCCESS, REMOVE_FOLLOWER_FAILURE, LOAD_USER_SUCCESS, LOAD_USER_FAILURE} from '../reducers/user'
import axios from 'axios';

function logInAPI(data){
    /* 중복되는 주소 처리 =>  */
    return axios.post('/user/login', data, )
   }
   /* action 은  login을 리퀘스트 받은 곳에서 action을 가져와 쓴다. action.type, action.data로 부른다. */
   function* logIn(action){
       console.log('사가 진입')
       /* 실패할 수도 있으니 try/catch로 감싼다. */
       /* 성공결과 */      
       try{
  
           const result = yield call(logInAPI, action.data)
          /*  const result = yield call(logInAPI, action.data,'a', 'b','c' ) */
           
           /* fork를 쓰면 axios.post('/api.login')
              yield put({
           type: 'LOG_IN_SUCCESS',
           data: result.data
      
           바로 실행되는 느낌*/
           /* call은  axios.post('/api.login')
           .then(() =>{
                        yield put({
               type: 'LOG_IN_SUCCESS',
               data: result.data
               이런느낌 ==>  여기선 result가 없으니 fork를 쓰면 안된다.
           })*/
           yield put({
           type: LOG_IN_SUCCESS,
           data: result.data
       });
       /* 실패결과 */
       }catch(err){
       yield put({
           type: LOG_IN_FAILURE,
           error: err.response.data
       })
       }
       /* 요청의 결과를 받는 곳 */
   }
   
   function logOutAPI(){
    return    axios.post('/user/logout')
   }
   function* logOut(){

       try
       {
        yield call(logOutAPI)
       /* const result = call(logOutAPI) */
        yield put({
            type: LOG_OUT_SUCCESS,
         
        })
       }catch(err){
       yield put({
           type: LOG_OUT_FAILURE,
           error: err.response.data
       })
       }
   }
/* data가 없기때문에 2번째 자리가 원래 withCredentials가 들어간다. */
    function loadMyInfoAPI(){
         return   axios.get('/user')
}
function* loadMyInfo(){
    try{
        const result = yield call(loadMyInfoAPI)

        yield put({
            type: LOAD_MY_INFO_SUCCESS,
            data: result.data
        })
    }catch(err){
        yield put({
            type: LOAD_MY_INFO_FAILURE,
            error: err.response.data
        })

    }
}
function loadUserAPI(data) {
    return axios.get(`/user/${data}`);
  }
  
  function* loadUser(action) {
    try {
      const result = yield call(loadUserAPI, action.data);
      yield put({
        type: LOAD_USER_SUCCESS,
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: LOAD_USER_FAILURE,
        error: err.response.data,
      });
    }
  }
function changeNicknameAPI(data){
    return axios.patch('/user/nickname', {nickname: data})
}

function* changeNickname(action){
    try {
        const result = yield call(changeNicknameAPI, action.data);
        yield put({
            type: CHANGE_NICKNAME_SUCCESS,
            data: result.data
        })
    } catch (err) {
        yield put({
            type: CHANGE_NICKNAME_FAILURE,
            error: err.response.data
        })
    }
}
function followAPI(data){
    return axios.patch(`/user/${data}/follow`)
}

function* follow(action){
    try {
        const result = yield call(followAPI, action.data);
        yield put({
            type: FOLLOW_REQUEST,
            data: result.data
        })
    } catch (err) {
        yield put({
            type: FOLLOW_FAILURE,
            error: err.response.data
        })
    }
}

function unFollowAPI(data){
    return axios.delete(`/user/${data}/follow`)
}

function* unFollow(action){
    try {
        const result = yield call(unFollowAPI, action.data);
        yield put({
            type: UNFOLLOW_SUCCESS,
            data: result.data
        })
    } catch (err) {
        yield put({
            type: UNFOLLOW_FAILURE,
            error: err.response.data
        })
    }
}
function loadFollowersAPI(data){
    return axios.get('/user/followers',data)
}
function* loadFollowers(action){
    try {
        const result = yield call(loadFollowersAPI,action.data)
        yield put({
            type: LOAD_FOLLOWERS_SUCCESS,
            data: result.data
        })
    }catch(err){
        yield put({
            type: LOAD_FOLLOWERS_FAILURE,
            error: err.response.data

        })
    }
}
function loadFollowingsAPI(data){
    return axios.get('/user/followings',data)
}
function* loadFollowings(action){
    try {
        const result = yield call(loadFollowingsAPI,action.data)
        yield put({
            type: LOAD_FOLLOWINGS_REQUEST,
            data: result.data
        })
    }catch(err){
        yield put({
            type: LOAD_FOLLOWINGS_FAILURE,
            error: err.response.data

        })
    }
}
function removeFollowerAPI(data){
    return axios.delete(`/user/follower/${data}`)
}
function* removeFollower(action){
    try {
        const result = yield call(removeFollowerAPI,action.data)
        yield put({
            type: REMOVE_FOLLOWER_SUCCESS,
            data: result.data
        })
    }catch(err){
        yield put({
            type: REMOVE_FOLLOWER_FAILURE,
            error: err.response.data

        })
    }
}

/* 여기가 이벤트리스너 같은 역할 */
function* watchLogIn(){
    yield takeLatest('LOG_IN_REQUEST', logIn);
}

function* watchLogOut(){
    yield takeLatest('LOG_OUT_REQUEST', logOut);
}
function* watchLoadMyInfo(){
    yield takeLatest('LOAD_MY_INFO_REQUEST', loadMyInfo)
}
function* watchLoadUser() {
    yield takeLatest('LOAD_USER_REQUEST', loadUser);
  }
function* watchChangeNickname(){
    yield takeLatest('CHANGE_NICKNAME_REQUEST', changeNickname) 
}
function* watchFollow(){
    yield takeLatest('FOLLOW_REQUEST', follow) 
}
function* watchUnfollow(){
    yield takeLatest('UNFOLLOW_REQUEST', unFollow) 
}
function* watchLoadFollowers(){
    yield takeLatest('LOAD_FOLLOWERS_REQUEST', loadFollowers)
}
function* watchLoadFollowings(){
    yield takeLatest('LOAD_FOLLOWINGS_REQUEST', loadFollowings)
}
function* watchRemoveFollower(){
    yield takeLatest('REMOVE_FOLLOWER_REQUEST', removeFollower)
}


export default function* userSaga() {
    yield all([
        fork(watchRemoveFollower),
        fork(watchLoadFollowers),
        fork(watchLoadFollowings),
        fork(watchFollow),
        fork(watchLoadUser),
        fork(watchUnfollow),
        fork(watchChangeNickname),
        fork(watchLogIn),
        fork(watchLogOut),
        fork(watchLoadMyInfo)
    ])
}