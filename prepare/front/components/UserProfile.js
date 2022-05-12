import React,{useCallback} from 'react'
import {useDispatch,useSelector} from 'react-redux'
import  {logoutRequestAction} from '../reducers/user'
import Link from 'next/link'
import {Card, Avatar, Button} from 'antd'
const UserProfile = (/* {setIsLoggedIn} */) => {
        
    const dispatch = useDispatch();
    const {me, logOutLoading} = useSelector((state) => state.user)
    
    const onLogout = useCallback(() => {
        /* setIsLoggedIn(false) */
       dispatch(logoutRequestAction())
    },[])
    console.log(me.Followers,me.Followings,me.Posts)
  return (
   <>
   <Card
    actions={[
        <div key="twit"><Link href={`/user/${me.id}`}><a >짹짹<br />{me.Posts.length}</a></Link></div>,
        <div key="followings"><Link href={`/profile`}><a >팔로잉 <br />{me.Followings.length}</a></Link></div>,
        <div key="followers"><Link href={`/profile`}><a >팔로워 <br />{me.Followers.length}</a></Link></div>,
    ]}
    >
       <Card.Meta
       avatar={<Link href={`/user/${me.id}`}><a >
           <Avatar>{me.nickname}</Avatar></a>
           </Link>}
       title={me.nickname}/>
       <Button
       onClick={onLogout}
       loading={logOutLoading}
       >로그아웃</Button>
   </Card>
   </>
  )
}

export default UserProfile