// hashtag/[tag].js//post/[id].js
import React, {useEffect} from 'react'
import { useRouter } from "next/router"
import axios from 'axios';
import Head from 'next/head';
import {END} from 'redux-saga';
import { useInView } from 'react-intersection-observer';
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_HASHTAG_POSTS_REQUEST, LOAD_POSTS_REQUEST } from "../../reducers/post";

import wrapper from '../../store/configureStore';
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { useDispatch, useSelector } from "react-redux";

const Post = () =>{
    const dispatch = useDispatch();
    const router = useRouter();
  const { tag} = router.query;
  const {singlePost} = useSelector((state) => state.post)
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector((state) => state.post);
  const [ref, inView] = useInView();
    console.log(singlePost)

    useEffect(
        () => {
          if (inView && hasMorePosts && !loadPostsLoading) {
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
              type: LOAD_POSTS_REQUEST,
              lastId,
              data: tag,
            });
          }
        },
        [inView, hasMorePosts, loadPostsLoading, mainPosts, tag],
      );
  return (
    <AppLayout>
    {mainPosts.map((c) => (
      <PostCard key={c.id} post={c} />
    ))}
    <div ref={hasMorePosts && !loadPostsLoading ? ref : undefined} style={{ height: 10 }} />
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
        type: LOAD_HASHTAG_POSTS_REQUEST,
        data: params.tag
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
})

export default Post;