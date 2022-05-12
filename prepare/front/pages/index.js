import React,{useEffect} from 'react'
import { useInView } from 'react-intersection-observer';
import AppLayout from '../components/AppLayout'
import Head from 'next/head'
import {useSelector,useDispatch} from 'react-redux'
import PostForm from '../components/PostForm'
import PostCard from '../components/PostCard'
import { LOAD_POSTS_REQUEST } from '../reducers/post'
import { LOAD_MY_INFO_REQUEST} from '../reducers/user'
import wrapper from '../store/configureStore';
import {END} from 'redux-saga';
import axios from 'axios'

const Home = () =>{
    const dispatch = useDispatch();
    const {me, id} =useSelector((state) => state.user);
    const  {mainPosts, hasMorePost, loadPostsLoading, retweetFailure}  = useSelector((state) => state.post)
    const [ref, inView] = useInView();

    
    useEffect(
        () => {
          if (inView && hasMorePost && !loadPostsLoading) {
            const lastId = mainPosts[mainPosts.length - 1]?.id;
            dispatch({
              type: LOAD_POSTS_REQUEST,
              lastId,
            });
          }
        },
        [inView, hasMorePost, loadPostsLoading, mainPosts],
      );
   
    return(
    <>
        <Head>
            <meta charSet = "utf-8"/>
            <title>NodeBird</title>
        </Head>
        <AppLayout>
             {me && <PostForm/>}
             {mainPosts.map((post) => <PostCard post={post} />)}
                <div ref={hasMorePost && !loadPostsLoading ? ref : undefined}  style={{ height: 10 }}/>
        </AppLayout>
    </>
    )
}

/* context안에 store가 들어있다. */
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
    store.dispatch({
        type: LOAD_POSTS_REQUEST
    });
    store.dispatch(END);
    await store.sagaTask.toPromise();
})
export default Home