import React,{useCallback} from 'react';
import {useSelector} from 'react-redux'
import PropTypes from 'prop-types';

import styled from 'styled-components'
import Link from 'next/link'

import { Menu, Input, Row, Col } from  'antd'
import { createGlobalStyle } from 'styled-components';

import LoginForm from '../components/LoginForm'
import UserProfile from '../components/UserProfile'
import useInput from '../hooks/useInput';
import Router from 'next/router'

const SearchInput = styled(Input.Search)`
  vertical-align: middle
  `
  const Global = createGlobalStyle`
  .ant_row{
    margin-right: 0 !important;
    margin-left: 0 !important;
  }
  .ant_col:first-child{
    padding-left: 0 !important;
  }

  .ant-col:last-child{
    padding-right: 0 !important;
  }
  `

const AppLayout =({children}) =>{
/*   const [isLoggedin,setIsLoggedIn] = useState(false); */
/*  */
const {me} = useSelector((state) =>  state.user)
/* const {isLoggedIn} = useSelector((state) =>  state.user) 도 가능
 */
const [searchInput, onChangeSearchInput] = useInput('');

const onSearch = useCallback(() =>{
  /*  동적라우팅 => 알아서 주소로 가서 서버사이드 렌더링 (getsersideprops실행)*/
  Router.push(`/hashtag/${searchInput}`)
},[searchInput])
  return (
    <div>
      <Global/>
      <Menu mode= "horizontal" >
        <Menu.Item>
          <Link href="/" key="home"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile" key="profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Input.Search 
          enterButton
          value={searchInput}
          onChange={onChangeSearchInput}
          onSearch={onSearch}/>
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup" key="signup"><a>회원가입</a></Link>
        </Menu.Item>
        </Menu>
        <Row gutter={8}>
          <Col xs={24}  md={6}>
            {me  
            ? <UserProfile /*  setIsLoggedIn={setIsLoggedIn} *//> 
            : <LoginForm /* setIsLoggedIn={setIsLoggedIn} *//>}
            </Col>
          <Col xs={24} md={12}>
          {children}
          </Col>
          <Col xs={24} md={6}>
            <a href="https://www.naver.com" 
            target="_blank" 
            rel="_noreferrer noopener">Mady by Inpyo</a>
            </Col>
        </Row>
    </div>
    )
};

AppLayout.propTypes = {
 children: PropTypes.node.isRequired,
};

export default AppLayout;