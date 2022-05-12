import produce from '../util/produce'

export const initialState = {
        loadFollowingsLoading: false, //유저정보 가져오기 시도중
        loadFollowingsDone: false, 
        loadFollowingsError: null,   
        loadFollowersLoading: false, //유저정보 가져오기 시도중
        loadFollowersDone: false, 
        loadFollowersError: null,   
        loadMyInfoLoading: false, //유저정보 가져오기 시도중
        loadMyInfoDone: false, 
        loadMyInfoError: null,    
        logInLoading: false, //로그아웃 시도중
        logInDone: false, 
        logInError: null, 
        logOutLoading: false,
        logOutDone: false,
        logOutFailure: null,
        signUpLoading: false,
        signUpDone: false,
        signUpError: null,
        followLoading: false, 
        followDone: false, 
        followError: null, 
        unfollowLoading: false, 
        unfollowDone: false, 
        unfollowError: null, 
        removeFollowerLoading: false, 
        removeFollowerDone: false, 
        removeFollowerError: null, 
        changeNicknameLoading: false,
        changeNicknameDone: false,
        changeNicknameError: null, 
        me: null,
        userInfo: null,
        signUpData: {},
        loginData: {}
 
}
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCEESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCEESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCEESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCEESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST ='LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';


export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE'; 

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE'; 

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME'

/* const dummyUser = (data) => ({
    ...data,
    nickname: '인표',
    id: 1,
    Posts: [],
    Followings: [{nickname: '한나'},{nickname: '인표'},{nickname: '준모'}],
    Followers: [{nickname: '한나'},{nickname: '인표'},{nickname: '준모'}]
}); */
 
export const loginRequestAction = (data) =>{
    // {email, password}
    return{
        type:LOG_IN_REQUEST,
        data
    }
}

export const logoutRequestAction = () =>{
    return{
        type:LOG_OUT_REQUEST,
    
    }
}
export const signUpRequsetAction = (data) =>({
    type: SIGN_UP_REQUEST,
    data
})

const reducer = (state = initialState, action)=>{
    
    return produce(state,(draft)=>{
        switch (action.type){  
            case LOAD_USER_REQUEST:
                draft.loadUserLoading = true;
                draft.loadUserError = null;
                draft.loadUserDone = false;
                break;
              case LOAD_USER_SUCCESS:
                draft.loadUserLoading = false;
                draft.userInfo = action.data;
                draft.loadUserDone = true;
                break;
              case LOAD_USER_FAILURE:
                draft.loadUserLoading = false;
                draft.loadUserError = action.error;
                break;
            case REMOVE_FOLLOWER_REQUEST:
                      draft.removeFollowerLoading= true;
                      draft.removeFollowerError= null;
                      draft.removeFollowerDone= false;                
                  break;
            case REMOVE_FOLLOWER_SUCCESS:
                    draft.removeFollowerLoading = false; 
                    draft.me.Followers = draft.me.Followers.filter((v) => v.id !== action.data.UserId)
                    draft.removeFollowerDone= true;     
                break;            
            case REMOVE_FOLLOWER_FAILURE:
                    draft.removeFollowerLoading= false;
                    draft.removeFollowerError= action.error;
                    break;
            case LOAD_FOLLOWERS_REQUEST:
                      draft.loadFollowersLoading= true;
                      draft.loadFollowersError= null;
                      draft.loadFollowersDone= false;                
                  break;
            case LOAD_FOLLOWERS_SUCCESS:
                    draft.loadFollowersLoading = false; 
                    draft.me.Followers = action.data;
                    draft.loadFollowersDone= true;    
                   
                break;            
            case LOAD_FOLLOWERS_FAILURE:
                    draft.loadFollowersLoading= false;
                    draft.loadFollowersError= action.error;
                    break;
            case LOAD_FOLLOWINGS_REQUEST:
                      draft.loadFollowingsLoading= true;
                      draft.loadFollowingsError= null;
                      draft.loadFollowingsDone= false;                
                  break;
            case LOAD_FOLLOWINGS_SUCCESS:
                    draft.loadFollowingsLoading = false; 
                    draft.me.Followings = action.data       
                    draft.loadFollowingsDone= true;    
                   
                break;            
            case LOAD_FOLLOWINGS_FAILURE:
                    draft.loadFollowingsLoading= false;
                    draft.loadFollowingsError= action.error;
                    break;
            case LOAD_MY_INFO_REQUEST:
                console.log('리듀서 진입')
                      draft.loadMyInfoLoading= true;
                      draft.loadMyInfoError= null;
                      draft.loadMyInfoDone= false;                
                  break;
            case LOAD_MY_INFO_SUCCESS:
                    draft.loadMyInfoLoading = false; 
                    draft.me = action.data       
                    draft.loadMyInfoDone= true;    
                   
                break;            
            case LOAD_MY_INFO_FAILURE:
                    draft.loadMyInfoLoading= false;
                    draft.loadMyInfoError= action.error;
                    break;
            case FOLLOW_REQUEST:
                console.log('리듀서 진입')
                      draft.followLoading= true;
                      draft.followError= null;
                      draft.followDone= false;                
                  break;
            case FOLLOW_SUCCESS:
                    draft.followLoading = false; 
                    draft.me.Followings.push({id: action.data.UserId})            
                    draft.followDone= true;    
                   
                break;            
            case FOLLOW_FAILURE:
                     
                    draft.followLoading= false;
                    draft.followError= action.error;
                    break;
            case UNFOLLOW_REQUEST:
                    console.log('리듀서 진입')
                    draft.unfollowLoading= true;
                    draft.unfollowError= null;
                    draft.unfollowDone= false;                
                    break;
            case UNFOLLOW_SUCCESS:
                    draft.unfollowLoading= false;
                    draft.me.Followings = draft.me.Followings.filter((v) => v.id !== action.data.UserId)
                    draft.unfollowDone= true;                
                break;            
            case UNFOLLOW_FAILURE:
                         
                    draft.unfollowLoading= false;
                    draft.unfollowError= action.error;
                    break;
            case LOG_IN_REQUEST:
              console.log('리듀서 진입')
                    draft.logInLoading= true;
                    draft.logInError= null;
                    draft.logInDone= false;                
                break
            case LOG_IN_SUCCESS:
                draft.logInLoading= false;
                draft.me = action.data;
                draft.logInDone= true;                
            break;            
            case LOG_IN_FAILURE:
                 
                draft.logInLoading= false;
                draft.logInError= action.error;
                break;
            case LOG_OUT_REQUEST: 
                        console.log('로그아웃 리듀서 진입')
        
                    draft.logOutLoading= true;
                    draft.logOutDone= false;
                    draft.logOutFailure= null;
                break;
            case LOG_OUT_SUCCESS:
                draft.logOutLoading= false;
                draft.logOutDone= true;
                draft.me = null;
                break;
            case LOG_OUT_FAILURE:
                draft.logOutLoading= false;
                draft.logOutFailure= action.error;
                break;
               
            case SIGN_UP_REQUEST: 
            console.log('회원가입 진입')

                draft.signUpLoading= true;
                draft.signUpDone= false;
                draft.signUpFailure= null;            
            break;
            case SIGN_UP_SUCCESS:
                draft.signUpLoading= false;
                draft.signUpDone= true;
            break;
            case SIGN_UP_FAILURE:
                draft.signUpLoading= false;
                draft.signUpFailure= action.error    ;
            break;         
            case CHANGE_NICKNAME_REQUEST: 
            console.log('회원가입 진입')
                draft.changeNicknameLoading= true;
                draft.changeNicknameDone= false;
                draft.changeNicknameFailure= null;            
                break;
            case CHANGE_NICKNAME_SUCCESS:
                draft.me.nickname =  action.data.nickname;
                draft.changeNicknameLoading= false;
                draft.changeNicknameDone= true;              
                break;
             
            case CHANGE_NICKNAME_FAILURE:
                draft.changeNicknameLoading= false;
                draft.changeNicknameFailure= action.error        
                break;
            case ADD_POST_TO_ME:
                draft.me.Posts.unshift({id: action.data});
                break;
               /*  return{
                    ...state,
                    me: {
                        ...state.me,
                        Posts: [{id: action.data}, ...state.me.Posts],
                    }
                } */
            case REMOVE_POST_OF_ME:
                draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data)
                break;
              /*   return{
                    ...state,
                    me:{
                        ...state.me,
                        Posts: state.me.Posts.filter((v) => v.id !== action.data)
                    },
                } */
            default: 
                break;
        }
    })
   

}
export default reducer;