import React,{useCallback} from 'react'
import {Button} from 'antd';
import PropTypes from 'prop-types'
import {useSelector, useDispatch} from 'react-redux'
import { UNFOLLOW_REQUEST, FOLLOW_REQUEST } from '../reducers/user';
const FollowButton =({post}) => {

 
        const dispatch = useDispatch();
        const {me, followLoading, unfollowLoading} = useSelector((state) => state.user)
      
       const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
       console.log(isFollowing)
       /*  me && me.Followings.find((v) => v.id === post.User.id) */
      
   
       const onClickButton = useCallback(()=>{
     
           if (isFollowing){
               console.log("언팔로잉")
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: post.User.id
            });
           }else{
            console.log('팔로잉')
            dispatch({
                type: FOLLOW_REQUEST,
                data:post.User.id
            });
           }
       
       },[isFollowing])
        /* return은 usecallback보단 아래 ==> 닉네임을 바꾼 후 팔로우 버튼이 안뜨게  */
       if(post.User.id === me.id){
            return null
    }

  return (
    <Button 
    onClick={onClickButton} 
    loading={followLoading || unfollowLoading}
    >{isFollowing? '언팔로우': '팔로우'}</Button>

  )
}

FollowButton.propTypes = {
    post: PropTypes.object.isRequired,
}

export default FollowButton