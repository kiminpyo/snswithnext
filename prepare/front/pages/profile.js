import React, {useEffect,useState, useCallback} from 'react';
import AppLayout from '../components/AppLayout'
import Head from 'next/head'
import axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import  Router from 'next/router';
import useSWR from 'swr';
import wrapper from '../store/configureStore';
import {END} from 'redux-saga';


import NicknameEditorForm from '../components/NicknameEditorForm'
import FollowList from '../components/FollowList'
import {LOAD_FOLLOWINGS_REQUEST,LOAD_FOLLOWERS_REQUEST, LOAD_MY_INFO_REQUEST} from '../reducers/user'


        const fetcher = (url) => axios.get(url, {withCredentials: true})
        .then((result) => result.data)
const Profile = () =>{
    const dispatch = useDispatch();
    const [followersLimit ,setFollowersLimit] = useState(3);
    const [followingsLimit ,setFollowingsLimit] = useState(3);

    const {me} = useSelector((state) => state.user)
    const {data: followersData, error: followerError} = useSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
    const {data: followingsData, error: followingError} = useSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
    
   
  /*   useEffect(()=>{
        dispatch({
            type: LOAD_FOLLOWERS_REQUEST,
        })
    },[])
    useEffect(() =>{
        dispatch({
            type: LOAD_FOLLOWINGS_REQUEST,
        })
    },[]) */
    useEffect(() => {
        if(me && me.id){   
            <div>로딩중</div>
        }
        
    },[me && me.id])

    const loadMoreFollowers = useCallback(() =>{
        setFollowingsLimit((prev) => prev +3);
    },[])
    
    const loadMoreFollowings = useCallback(() =>{
        setFollowersLimit((prev) => prev +3);
    },[])
    if(!me){
        Router.push('/')  
        return null;
    }

    if(followerError || followingError){
        console.error(followerError || followingError);
        return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>
    }

      

   
    return (
    <>
    <Head>
        <meta charSet='utf-8' />
        <title>내 프로필 | NodeBiard
        </title>

    </Head>
    <AppLayout>
        <NicknameEditorForm/>
        <FollowList header= "팔로잉 목록" data={followingsData} onClickMore={loadMoreFollowings} loading={!followingsData && !followingError}/>
        <FollowList header = "팔로워 목록" data={followersData} onClickMore={loadMoreFollowers} loading={!followersData && !followingError}/>
    </AppLayout>
    </>
    )
}
export const getServerSideProps = wrapper.getServerSideProps((store)=> async({req}) => {
    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    /* 쿠키가 있고, 서버에 요청을 할 때만 넣는다. (다른사람의 내 쿠키 공유 문제 제거. 굉장히 중요하다) */
    if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
    store.dispatch({
        type: LOAD_MY_INFO_REQUEST
     });
    store.dispatch(END);
    await store.sagaTask.toPromise();
})
export default Profile