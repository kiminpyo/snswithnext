


import produce from '../util/produce';
/* import {faker} from  '@faker-js/faker';  */
    export const initialState = {
        singlePost: null,
        mainPosts: [], 
        imagePaths: [],
        hasMorePost: true,
        likePostLoading: false,
        likePostDone: false,
        likePostFailure: null,
        unlikePostLoading: false,
        unlikePostDone: false,
        unlikePostFailure: null,
        loadPostLoading: false,
        loadPostDone: false,
        loadPostFailure: null,
        loadPostsLoading: false,
        loadPostsDone: false,
        loadPostsFailure: null,
        addPostLoading: false,
        addPostDone: false,
        addPostFailure: null,
        uploadImagesLoading: false,
        uploadImagesDone: false,
        uploadImagesFailure: null,
        removePostLoading: false,
        removePostDone: false,
        removePostFailure: null,
        retweetLoading: false,
        retweetDone: false,
        retweetFailure: null,
        addCommentLoading:false,
        addCommentDone: false,
        addCommentFailure: null,
       
    }
/* export const generateDummyPost = (number) => Array(number).fill().map(()=> ({
        id: shortId.generate(),
        User:{
            id:shortId.generate(),
            nickname: faker.name.findName()
        },
        content: faker.lorem.paragraph(),
        Images: [{
            id: shortId.generate(),
            src: faker.image.avatar()
        }],
        Comments:[{
            id: shortId.generate(),
            User:{
                id: shortId.generate(),
                nickname: faker.name.findName()
            },  
            content: faker.lorem.sentence()
        }],
    })); */
export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';    

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE'; 

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE'; 

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE'; 

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';  

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE'; 

 export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
 export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
 export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

 
 export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
 export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
 export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

 export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
 export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
 export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';
   
 export const REMOVE_IMAGE = 'REMOVE_IMAGE';
    
 export const addPost = (data) => ({
        type: ADD_POST_REQUEST,
        data
    });

    export const addComment = (data) => ({
        type: ADD_COMMENT_REQUEST,
        data
    });
    


   /*  const dummyComment= (data) =>({
        id: shortId.generate(),
        content: data,
        User: {
            id: 1,
            nickname: '인표',
        },
    }) */
/* 이전상태를 액션을 통해 다음 상태로 만들어내는 함수 (불변성은 지키면서) */
const reducer = (state = initialState, action) => {
    return produce(state,(draft) =>{
        switch (action.type){
            case LOAD_POST_REQUEST:     
            draft.loadPostLoading = true;
            draft.loadPostDone = false;
            draft.loadPostFailure = null;
            break;

            case LOAD_POST_SUCCESS:   {
            draft.loadPostLoading = false;
            draft.loadPostDone = true; 
            draft.singlePost = action.data;   
            break;
            }
            case LOAD_POST_FAILURE:
               
            draft.loadPostLoading= false;
            draft.loadPostFailure= action.error;
            break;
            case RETWEET_REQUEST:     
            draft.retweetLoading = true;
            draft.retweetDone = false;
            draft.retweetFailure = null;
            break;

            case RETWEET_SUCCESS:   {
            draft.retweetLoading = false;
            draft.retweetDone = true; 
            draft.mainPosts.unshift(action.data)     
            break;
            }
            case RETWEET_FAILURE:
               
            draft.retweetLoading= false;
            draft.retweetFailure= action.error;
            break;
            /* 클라이언트 단만 지우기 때문에 동기식 처리로 한다 => reducer에서 한번에 처리가능 */
            case REMOVE_IMAGE:     
            draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data );
            break;
            case UPLOAD_IMAGES_REQUEST:     
            draft.uploadImagesLoading = true;
            draft.uploadImagesDone = false;
            draft.uploadImagesFailure = null;
            break;

            case UPLOAD_IMAGES_SUCCESS:   {
            draft.imagePaths = action.data;
            draft.uploadImagesLoading = false;
            draft.uploadImagesDone = true;      
            break;
            }
            case UPLOAD_IMAGES_FAILURE:
               
            draft.uploadImagesLoading= false;
            draft.uploadImagesFailure= action.error;
            break;

            case LIKE_POST_REQUEST:     
            draft.likePostLoading = true;
            draft.likePostDone = false;
            draft.likePostFailure = null;
            break;

            case LIKE_POST_SUCCESS:   {
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Likers.push({id: action.data.UserId});
            console.log(action.data)        
            draft.likePostLoading = false;
            draft.likePostDone = true;      
            break;
            }
            case LIKE_POST_FAILURE:
               
            draft.likePostLoading= false;
            draft.likePostFailure= action.error;
            break;
            case UNLIKE_POST_REQUEST:     
            draft.unlikePostLoading = true;
            draft.unlikePostDone = false;
            draft.unlikePostFailure = null;
            break;
            case UNLIKE_POST_SUCCESS:   {
            const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
            post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId)
            console.log(action.data)        
            draft.unlikePostLoading = false;
            draft.unlikePostDone = true;    
            break;
            }
            
            case UNLIKE_POST_FAILURE:         
            draft.unlikePostLoading= false;
            draft.unlikePostFailure= action.error;
            break;
            case LOAD_USER_POSTS_REQUEST: 
            case LOAD_HASHTAG_POSTS_REQUEST: 
            case LOAD_POSTS_REQUEST:     
            draft.loadPostsLoading = true;
            draft.loadPostsDone = false;
            draft.loadPostsFailure = null;
            break;
            case LOAD_USER_POSTS_SUCCESS: 
            case LOAD_HASHTAG_POSTS_SUCCESS: 
            case LOAD_POSTS_SUCCESS:        
            console.log(action.data)        
            draft.loadPostsLoading = false;
            draft.loadPostsDone = true;
            draft.mainPosts = draft.mainPosts.concat(action.data);
            draft.hasMorePost = action.data.length === 10;
            /* 기존 데이터에 더미데이터를 합치는것 */
            break;
            case LOAD_USER_POSTS_FAILURE: 
            case LOAD_HASHTAG_POSTS_FAILURE: 
            case LOAD_POSTS_FAILURE:
               
            draft.loadPostsLoading= false;
            draft.loadPostsFailure= action.error;
            break;
            case ADD_POST_REQUEST:     
                draft.addPostLoading = true;
                draft.addPostDone = false;
                draft.addPostFailure = null;
              break;
            case ADD_POST_SUCCESS:               
    
                draft.addPostLoading = false;
                draft.addPostDone = true;
                draft.mainPosts.unshift(action.data);
                draft.imagePaths= [];     
                 /*   draft.mainPosts = [dummyPost(action.data), ...state.mainPosts]; */
            break;
            case ADD_POST_FAILURE:
                   
                draft.addPostLoading= false;
                draft.addPostFailure= action.error;
                break;
            case REMOVE_POST_REQUEST:         
                draft.removePostLoading= true;
                draft.removePostDone= false;
                draft.removePostFailure= null;
                break;
            case REMOVE_POST_SUCCESS:
                   /*  mainPosts: state.mainPosts.filter((v) => v.id !== action.data), */
              
                draft.removePostLoading = false;
                draft.removePostDone = true;
                draft.mainPosts = draft.mainPosts.filter((v) => v.id !== action.data.PostId);
                break;
            case REMOVE_POST_FAILURE:
             
                draft.removePostLoading =false;
                draft.removePostFailure = action.error;
                break;
            case ADD_COMMENT_REQUEST:
               
                draft.addCommentLoading= true,
                draft.addCommentDone= false,
                draft.addCommentFailure= null
                break;
            case ADD_COMMENT_SUCCESS:
                /* 서버 routes쪽 post에서 postId를 PostId로 보낸다.
                 => action.data에도 PostId로 들어온다 */
                const post =draft.mainPosts.find((v) => v.id === action.data.PostId);
                post.Comments.unshift(action.data)                           
                draft.addCommentLoading = false;
                draft.addCommentDone = true;
                break;
            case ADD_COMMENT_FAILURE:
                    draft.addCommentLoading= false;
                    draft.addCommentFailure= action.error;
             break;
            default: 
                break;
        }
    })
  

}

export default reducer