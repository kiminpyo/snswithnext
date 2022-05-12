import React,{useCallback,useState, useEffect} from 'react'
import AppLayout from '../components/AppLayout'
import Router from 'next/router'
import Head from 'next/head'
import axios from 'axios';
import { END } from 'redux-saga';
import wrapper from '../store/configureStore'
import {Form, Input, Checkbox, Button} from 'antd'
import styled from 'styled-components'
import useInput from '../hooks/useInput'
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from '../reducers/user'
import {useSelector, useDispatch} from 'react-redux'

const ErrorMessage = styled.div`
    color: red
    `;

const Signup = () =>{

  
    /* 중복 커스텀훅으로 처리 */
    const dispatch = useDispatch();
    const {signUpLoading, signUpDone, signUpFailure , logInDone} = useSelector((state) => state.user);

    useEffect(() =>{
        /* 로그인 성공시 회원가입 페이지로 아예 나가도록 */
        if(logInDone){  
            /*  Router.push('/');  얘도 괜찮은데 뒤로가기 할 시에 다시 살아난다 */
            Router.replace('/');   
        }
    },[logInDone])

    useEffect(() => {
        if(signUpDone){
            Router.replace('/')
        }
    }, [signUpDone])

    useEffect(() => {
        if(signUpFailure){
            alert(signUpFailure)
        }
    },[signUpFailure])
    const [email , onChangeEmail] = useInput('');
    const [password ,onChangePassword] =  useInput('');
    const [nickname ,onChangeNickname] =  useInput('');
    
   const [ passwordCheck, setPasswordCheck] = useState('')
   const [ passwordError, setPasswordError] = useState(false)
    
   
   const onChangePasswordCheck = useCallback((e) =>{
        setPasswordCheck(e.target.value)
        setPasswordError(e.target.value !== password)
    },[password])
    
    const [term, setTerm] =useState('')
    const [termError, setTermError] =useState(false)
    
    const onChangeTerm = useCallback((e)=>{
        setTerm(e.target.checked)
        setTermError(false)
    },[term])

    const onSubmit = useCallback(() =>{
        if(password !== passwordCheck){
            return setPasswordError(true);
        }
        if(!term){
            return setTermError(true)
        }
        console.log(email,nickname,password)
        dispatch({
            type: SIGN_UP_REQUEST,
        data : {email, password, nickname}})
    },[email,password,passwordCheck,term])

    return (
    <>
     
    <AppLayout>
    <Head>
        <title>회원가입 | NodeBiard</title>
    </Head>
        <Form onFinish={onSubmit}>
            <div>
                <label htmlFor="user-email">아이디</label>
                <br />
                <Input name="user-email" type="email" value={email} onChange={onChangeEmail}/>
            </div>
            <div>
                <label htmlFor="user-nickname">닉네임</label>
                <br />
                <Input name="user-nickname"  value={nickname} onChange={onChangeNickname}/>
            </div>
            <div>
                <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input 
                name="user-password" 
                type="password" 
                value={password}  
                required 
                onChange={onChangePassword}/>
            </div>
            <div>
                <label htmlFor="user-password-check">비밀번호체크</label>
                <br />
                <Input 
                name="user-password"
                type="password" 
                value={passwordCheck}
                required
                onChange={onChangePasswordCheck}
                />
                {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}            
            </div>
            <div>
            <Checkbox 
            name="user-term" 
            checked={term} 
            onChange={onChangeTerm}>내 말에 동의? 어 동의 보감?</Checkbox>
                {termError && <ErrorMessage>약관에 동의 어 동의?.</ErrorMessage>}
            </div>
            <div style={{marginTop: 10}}>
            <Button 
            type="_primary" 
            htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
        </Form>
    </AppLayout>
    </> 
    )
}
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
    console.log('getServerSideProps start');
    console.log(req.headers);
    const cookie = req ? req.headers.cookie : '';
    axios.defaults.headers.Cookie = '';
    if (req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }
    store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    store.dispatch(END);
    console.log('getServerSideProps end');
    await store.sagaTask.toPromise();
  });

export default Signup