import React,{useCallback, useState, useRef, useEffect} from 'react'
import {Form, Input, Upload, Button} from 'antd'
import {useSelector, useDispatch} from 'react-redux'
import {addPost, ADD_POST_REQUEST} from '../reducers/post'
import useInput from '../hooks/useInput'
import { backUrl } from '../config/config'
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post'
const PostForm = () => {



    const dispatch =useDispatch();
    const imgInput = useRef();
    const {imagePaths, addPostDone} = useSelector((state) => state.post)
    const [text, onChangeText, setText] = useInput('');

    useEffect(() => {
        if(addPostDone){
            setText('')
        }
    },[addPostDone])

    const onSubmit = useCallback(()=>{
        if(!text || !text.trim()){
            return alert('게시글을 작성하세요.')
        }
         const formData = new FormData();
        imagePaths.forEach((p) =>{
            formData.append('image',p);
        })
        formData.append('content', text);
        return dispatch({
            type: ADD_POST_REQUEST,
            data:  formData
        })
    },[text, imagePaths])

    const onClickImageUpload =useCallback(() =>{
    imgInput.current.click();
    },[imgInput.current])

    const onChangeImages =useCallback((e)=>{
        /* 이미지에 대한 정보 */
        console.log('images', e.target.files)
        /* 멀터는 무조건 멀티파트로 보내야 처리된다. */
        const imageFormData = new FormData();
        [].forEach.call(e.target.files, (f) =>{
            /* appned(키, 값) */
            imageFormData.append('image', f)
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData
        })
    })
    /* map안에 callback함수의 데이터 넣고싶을때 고차함수 */
    const onRemoveImage= useCallback((index) => () =>{
        dispatch({
            type: REMOVE_IMAGE,
            data: index
        })
    },[]) 
    
  return (
   <Form style={{margin: '10px 0 20px'}} encType="multipart/form-data" onFinish={onSubmit}>
       <Input.TextArea
        value={text}
        onChange ={onChangeText}
        maxLength={140}
        placeholder ="어떤일이 있었나요?"
       />
       <div>
           {/* 여기서 올린 게 백에 image쪽으로 전달  */}
           <input type="file" 
           name="image" 
        
           multiple 
           hidden 
           ref={imgInput} 
           onChange={onChangeImages} />
           <Button onClick={onClickImageUpload}>이미지 업로드</Button>
           <Button type="primary" style={{float: 'right'}} htmlType="submit">짹쨱</Button>
       </div>
       <div>
           {imagePaths.map((v,i) => (
               <div key={v} style={{display: 'inline-block'}}>
                   <img src={`${backUrl}/images/${v}`} style={{width: '200px'}} alt={v} />
                   <div>
                       <Button onClick={onRemoveImage(i)}>제거</Button>
                   </div>
               </div>
           ))}
       </div>
   </Form>
  )
}

export default PostForm