import React,{useState, useCallback, useMemo, useEffect} from 'react'
import Link from 'next/Link'
import  {useDispatch,useSelector} from 'react-redux'

import { loginRequestAction } from '../reducers/user'

import styled from 'styled-components'
import useInput from '../hooks/useInput'

import PropTypes from 'prop-types'
import {Form, Input, Button} from 'antd'

const ButtonWrapper = styled.div`
    margin-top: 10px;
    `;

    const FormWrapper = styled(Form)`
    padding: 10px
    `;

const LoginForm =(/* {setIsLoggedIn} */) => {
    const {logInLoading, logInFailure} =useSelector((state) => state.user)
    const dispatch = useDispatch();

    useEffect(()=>{
        if(logInFailure){
            alert(logInFailure)
        }
    },[logInFailure])
    
    const [email,onChangeEmail] =useInput('')  
    const [password, onChangePassword]= useInput('')

    const style = useMemo(() =>({ marginTop:10 }),[])

    const onSubmitForm = useCallback(() =>{
        /* antd 에선 preventDefault가 적용되어있다 */
        console.log(email,password)
        dispatch(loginRequestAction({email, password}))
      /*   setIsLoggedIn(true) */
    },[email,password])

   
  return (
    <>
        <FormWrapper onFinish={onSubmitForm}>
            <div>
                <label htmlFor="user-email">이메일</label>
                <br />
                <Input name="user-email" type="email"value={email} onChange={onChangeEmail}/>
            </div>
            <div>
            <label htmlFor="user-password">비밀번호</label>
                <br />
                <Input name="user-password" value={password} onChange={onChangePassword} required/>
            </div>
            <ButtonWrapper>
                <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
                <Link href="/signup"><a><Button>회원가입</Button></a></Link>
            </ButtonWrapper>
        </FormWrapper>
    </>
  )
}


export default LoginForm