import React,{useCallback} from 'react'
import {Card, List, Button} from 'antd';
import {StopOutlined} from '@ant-design/icons'
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { UNFOLLOW_REQUEST, REMOVE_FOLLOWER_REQUEST } from '../reducers/user';

const FollowList =({header, data, onClickMore, loading}) => {

        const dispatch = useDispatch();
        /* 고차함수 반복문 안에서  item에 대한 데이터를 보내고 싶을 때  */
    const onCancel =(id) => () =>{
        if(header === '팔로잉'){
            dispatch({
                type: UNFOLLOW_REQUEST,
                data: id,
            })
        }
      dispatch({
        type: REMOVE_FOLLOWER_REQUEST,
        data: id,
    })
    }
    
  return (
      /* 나중에는 무조건 최적화를 해야한다 */
     <List
        style={{marginBottom: 20}}
        grid={{gutter: 4, xs:2, md:3}}
        size="small"
        header={
            <div>{header}</div>
        }
        loadMore={
            <div style={{textAlign: 'center', margin:'10px 0'}}>
                <Button loading={loading} onClick={onClickMore}>더 보기</Button>
            </div>
        }
        bordered
        dataSource={data}
        renderItem={(item) =>(
            <List.Item
                style={{marginTop: 20}}>
                <Card actions={[<StopOutlined key="stop" onClick={onCancel(item.id)}/>]}>
                <Card.Meta description={item.nickname}/>
                </Card>
            </List.Item>
        )}
        /> 

  )
};
FollowList.propTypes={
    header: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onClickMore: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
}

export default FollowList