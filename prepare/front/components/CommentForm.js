import React,{useCallback,useEffect} from 'react'
import PropTypes from 'prop-types'
import {useSelector, useDispatch} from 'react-redux'
import {Form, Input,Button} from 'antd'
import useInput from '../hooks/useInput'
import { addComment } from '../reducers/post'

const CommentForm = ({post}) => {
    const dispatch = useDispatch();
    const id = useSelector((state) => state.user.me?.id)
    const {addCommentDone, addCommentLoading} = useSelector((state) => state.post)
    const [commentText, onChangeComment, setCommentText] = useInput('')
    
    useEffect(() => {
        if(addCommentDone){
            setCommentText('')
        }
    },[addCommentDone])
    console.log(post)
    const onSubmitComment = useCallback(() => {
        console.log(post.id, commentText, id)
        /* dispatch({
            type: ADD_COMMENT_REQUEST,
            data: {content: comment
                Text, postId: post.id, userId: id}
        }) */
        dispatch(addComment( {content: commentText, postId: post.id, userId: id}))
    }, [commentText, id])

  return (
    <Form onFinish={onSubmitComment}>
        <Form.Item style={{position:'relative', margin: 0}}>
            <Input.TextArea value={commentText} onChange={onChangeComment} rows={4}/>
            <Button  
                style={{position: 'absolute', right: 0, bottom: -40, zIndex: 1}}
                type="primary"
                htmlType="submit"
                loading={addCommentLoading} >삐약</Button>
        </Form.Item>
    </Form>
  )
}

CommentForm.prototype = {
    post: PropTypes.string.isRequired,
}

export default CommentForm;