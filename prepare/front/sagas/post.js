import {all, fork, take, call, put, takeEvery,takeLatest, delay} from 'redux-saga/effects'
import axios from 'axios'
import {ADD_POST_FAILURE,ADD_POST_REQUEST,ADD_POST_SUCCESS,
        ADD_COMMENT_REQUEST,ADD_COMMENT_SUCCESS,ADD_COMMENT_FAILURE,
        REMOVE_POST_REQUEST,
        REMOVE_POST_SUCCESS,
        REMOVE_POST_FAILURE,
        LOAD_POSTS_REQUEST,
        LOAD_POSTS_SUCCESS, 
        LOAD_POSTS_FAILURE,
        LIKE_POST_REQUEST,UNLIKE_POST_REQUEST,LIKE_POST_SUCCESS,
        LIKE_POST_FAILURE, UNLIKE_POST_SUCCESS, UNLIKE_POST_FAILURE, UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE, RETWEET_REQUEST, RETWEET_FAILURE, RETWEET_SUCCESS, LOAD_POST_REQUEST, LOAD_POST_FAILURE, LOAD_POST_SUCCESS, LOAD_HASHTAG_POSTS_SUCCESS, LOAD_HASHTAG_POSTS_FAILURE, LOAD_USER_POSTS_FAILURE, LOAD_USER_POSTS_SUCCESS, LOAD_USER_POSTS_REQUEST, LOAD_HASHTAG_POSTS_REQUEST, } from '../reducers/post'
import { ADD_POST_TO_ME, FOLLOW_FAILURE, FOLLOW_REQUEST, FOLLOW_SUCCESS, REMOVE_POST_OF_ME, 
    UNFOLLOW_FAILURE, UNFOLLOW_REQUEST, UNFOLLOW_SUCCESS } from '../reducers/user';


function addPostAPI(data){
    /* req.body.content를 만든다 */
  return  axios.post('/post',data)
}

function* addPost(action){

    try {
        const result = yield call(addPostAPI, action.data);
        console.log(result)
       /*  const result = call(addPostAPI, action.data); */
        yield put({
            type: ADD_POST_SUCCESS,
            data: result.data
        } )
        yield put({       
            type: ADD_POST_TO_ME,
            data: result.data.id
        })
    }catch(err){
        yield put({
        type: ADD_POST_FAILURE,
        error: err.response.data
    })
    }
}
function addCommentAPI(data){
    /* 주소는 약속. => 특이한구조 data.postId가 주소에 있다. */
   return axios.post(`/post/${data.postId}/comment`,data) // POST 주소: /post/1/comment =>1번의 게시글에 댓글
}
function* addComment(action){
    try{
        const result = yield call(addCommentAPI, action.data);
        yield put({
            type: ADD_COMMENT_SUCCESS,
            data: result.data
        })
    }catch(err){
        console.log(err)
        yield put({
            type:ADD_COMMENT_FAILURE,
            error: err.response.data
        })
    }
}

function removePostAPI(data){
    return axios.delete(`/post/${data}`)
}
function* removePost(action){
    try{
        const result = yield call(removePostAPI, action.data)
    
        yield put({
            type: REMOVE_POST_SUCCESS,
            data: result.data,
        })
        yield put({
            type: REMOVE_POST_OF_ME,
            data: action.data
        })
    }catch(err){
        console.log(err)
        yield put({
            type: REMOVE_POST_FAILURE,
            error: err.action.data
        })

    }
}
function loadPostsAPI(lastId){
    /* get은 데이터 캐싱도 할수있는 이점이 있다. 
    get에서 데이터를 찍으려면 ?key=value의 구조다 원래는 2번째 파라미터가 withcredential이다 
    게시물이 0인 경우도 생각*/
    return axios.get(`/posts?lastId=${lastId || 0}`)
}

function* loadPosts(action){
    try {
  
     const result = yield call(loadPostsAPI, action.lastId)
        yield put({
            type: LOAD_POSTS_SUCCESS,
            data: result.data
            
        })
    }catch(err){
        yield put({
            type: LOAD_POSTS_FAILURE,
            error: err.response.data
        })
    }
}

function loadPostAPI(data){
    return axios.get(`/post/${data}`)
}

function* loadPost(action){
    try {
  
     const result = yield call(loadPostAPI, action.data)
        yield put({
            type:  LOAD_POST_SUCCESS,
            data: result.data
            
        })
    }catch(err){
        yield put({
            type: LOAD_POST_FAILURE,
            error: err.response.data
        })
    }
}
function loadHashtagPostsAPI(data, lastId) {
    return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
  }
  
  function* loadHashtagPosts(action) {
    try {
      console.log('loadHashtag console');
      const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
      yield put({
        type: LOAD_HASHTAG_POSTS_SUCCESS,
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: LOAD_HASHTAG_POSTS_FAILURE,
        error: err.response.data,
      });
    }
  }

  function loadUserPostsAPI(data, lastId) {
      console.log(lastId, data)
    return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
  }
  
  function* loadUserPosts(action) {

    try {
      const result = yield call(loadUserPostsAPI, action.data, action.lastId);
      yield put({
        type: LOAD_USER_POSTS_SUCCESS,
        data: result.data,
      });
    } catch (err) {
      console.error(err);
      yield put({
        type: LOAD_USER_POSTS_FAILURE,
        error: err.response.data,
      });
    }
  }

function likePostAPI(data){
  return axios.patch(`/post/${data}/like`)
}

function* likePost(action){
    try{
        const result = yield call(likePostAPI, action.data)
        yield put({
            type: LIKE_POST_SUCCESS,
            /* PostId랑 UserId들어있다. */
            data: result.data
        })
    }catch(err){
        console.log(err)
        yield put({
            type: LIKE_POST_FAILURE,
            error: err.response.data
        })

    }
}
/* restAPI쓸떄는 patch말고 delete도 가능하다  */
function unlikePostAPI( data ){
    return axios.delete(`/post/${data}/like`)
}
function* unlikePost(action){
    try{
        const result = yield call(unlikePostAPI, action.data)
        yield put({
            type: UNLIKE_POST_SUCCESS,
            data: result.data
        })
    }catch(err){
        console.log(err)
        yield put({
            
            type: UNLIKE_POST_FAILURE,
            error: err.response.data
        })

    }
}

function uploadImagesAPI( data ){
    /*{name: data} 이런식으로 감싸면 json타입이 된다. 그냥 data그대로 들어가야한다.  */
    return axios.post(`/post/images`, data)
}
function* uploadImages(action){
    try{
        const result = yield call(uploadImagesAPI, action.data)
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data
        })
    }catch(err){
        console.log(err)
        yield put({
            
            type: UPLOAD_IMAGES_FAILURE,
            error: err.response.data
        })

    }
}
    function retweetAPI(data){
       return  axios.post(`/post/${data}/retweet`)
    }

    function* retweet(action){
        try{
            const result = yield call(retweetAPI, action.data)
            yield put({
                type: RETWEET_SUCCESS,
                data: result.data
            })
        }catch(err){
            console.error(err);
            yield put({
                type: RETWEET_FAILURE,
                error: err.response.data
            })
        }
    }


function* watchAddPost(){
    yield takeLatest(ADD_POST_REQUEST , addPost);
}
function* watchAddComment(){
    yield takeLatest(ADD_COMMENT_REQUEST, addComment)
}

function* watchRemovePost(){
    yield takeLatest(REMOVE_POST_REQUEST, removePost)
}

function* watchLoadPosts(){
    yield takeLatest(LOAD_POSTS_REQUEST, loadPosts)
}
function* watchLoadUserPosts(){
    yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts)
}
function* watchLoadHashtagPosts(){
    yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts)
}

function* watchLikePost(){
    yield takeLatest(LIKE_POST_REQUEST, likePost)
} 
function* watchUnlikePost(){
    yield takeLatest(UNLIKE_POST_REQUEST, unlikePost)
}
function* watchUploadIamges(){
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages)
}
function* watchRetweet(){
    yield takeLatest(RETWEET_REQUEST, retweet)
}
function* watchLoadPost(){
    yield takeLatest(LOAD_POST_REQUEST, loadPost)
}
export default function* postSaga(){
    yield all([
        fork(watchLoadPost),
        fork(watchRetweet),
        fork(watchUploadIamges),
        fork(watchAddPost),
        fork(watchAddComment),
        fork(watchRemovePost),
        fork(watchLoadUserPosts),
        fork(watchLoadHashtagPosts),
        fork(watchLoadPosts),

        fork(watchLikePost),
        fork(watchUnlikePost)
    ])
}