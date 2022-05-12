//post/[id].js
import React, {useEffect} from 'react'
import { useRouter } from "next/router"
import axios from 'axios';
import Head from 'next/head';
import {END} from 'redux-saga';
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";

import wrapper from '../../store/configureStore';
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { useSelector } from "react-redux";

const Post = () =>{
    const router = useRouter();
  const {id} = router.query;
  const {singlePost} = useSelector((state) => state.post)
 
    console.log(singlePost)

  
  return (
   <AppLayout>
       <Head>
           <title>
               {singlePost.User.nickname}
               님의 글
           </title>
       </Head>
       <meta name="description" content={`${singlePost.nickname}님의 게시글`} />
          <meta property="og:title" content={`${singlePost.nickname}님의 게시글`} />
          <meta property="og:description" content={`${singlePost.nickname}님의 게시글`} />
          <meta property="og:image" content="https://nodebird.com/favicon.ico" />
          <meta property="og:url" content={`https://nodebird.com/user/${id}`} />
       <PostCard post={singlePost}/>
   </AppLayout>
  )
}
export const getServerSideProps = wrapper.getServerSideProps((store)=> async({req, params}) => {
    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    /* 쿠키가 있고, 서버에 요청을 할 때만 넣는다. (다른사람의 내 쿠키 공유 문제 제거. 굉장히 중요하다) */
    if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
    store.dispatch({
        type: LOAD_MY_INFO_REQUEST
     });
     store.dispatch({
        type: LOAD_POST_REQUEST,
        data: params.id
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
})

export default Post;