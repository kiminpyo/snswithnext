import React from 'react'
import Link from 'next/Link';
import PropTypes from 'prop-types'
const PostCardContent = ({postData}) => { /* 첫 번째 게시글 # 해시태그 */
  return (
    <div>
        {postData.split(/(#[^\s#]+)/g).map((v,i ) => {
            if(v.match(/(#[^\s#]+)/g)){
                return <Link href={`/hashtag/${v.slice(1)}`} key={i}><a>{v}</a></Link>
            }

            return v;
            })}
    </div>
  )
}

PostCardContent.propTypes ={
    postData: PropTypes.string.isRequired
}

export default PostCardContent