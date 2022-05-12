const express = require('express');

const multer = require('multer');
const path = require('path'); 
/* 파일 시스템 조작 */
const fs = require('fs');


const {Post, Image, Comment, User, Hashtag} = require('../models');
const { isLoggedIn} = require('./middlewares')


const router = express.Router();
try {
    fs.accessSync('uploads');
  } catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
  }
    /* multer는 폼마다 데이터를 전송하는 형식이나 타입이 달라서 app.js가 아닌 개별적으로 넣는다 */
    const upload = multer({
        storage: multer.diskStorage({
          destination(req, file, done) {
            done(null, 'uploads');
          },
          filename(req, file, done) { // 제로초.png
            const ext = path.extname(file.originalname); // 확장자 추출(.png)
            const basename = path.basename(file.originalname, ext); // 제로초
            done(null, basename + '_' + new Date().getTime() + ext); // 제로초15184712891.png
          },
        }),
        limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
      });
/* app.js 에서 가져올 때 router 선언 후 app.post-> router.post로 바꾸고 안쪽의 
'/post'에서 post를 제거 후  app.js 에서 app.use('prefix','라우터 변수')로 해준다.
 */
router.post('/', isLoggedIn, upload.none() ,async(req,res, next)=>{ /*  /post */

    try {
        const hashtag = req.body.content.match(/#[^\s#]+/g)
       const post = await Post.create({
            content: req.body.content,
            /* 로그인을 한 후부터는 passport의 deserializeUser가 실행되어 user를 찾을 수 있다. */
            UserId: req.user.id,
        });
        if(hashtag){
            /* 해쉬태그에 #노드 #노스 #익스프레스를 쓰면 노드가 두번이 등록된다. 그래서 create를 쓰지말고 
            findOrCreate를 쓴다. => craete를 쓰면 name: tag.slice(1).toLowerCase()이건데 findOrCreate를 쓰면
            where를 넣는다.*/
         const result = await Promise.all(hashtag.map((tag) => Hashtag.findOrCreate({
                where: {name: tag.slice(1).toLowerCase()}
                })))
                /* [#노드, true], [#리액트, true] => result의 모양이 이렇게 된다.(findOrcrrate) */
                await post.addHashtags(result.map((v) => v[0]))
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
              const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
              await post.addImages(images);
            } else { // 이미지를 하나만 올리면 image: 제로초.png
              const image = await Image.create({ src: req.body.image });
              await post.addImages(image);
            }
          }
        /* include 작업 */
        const fullPost = await Post.findOne({
            where: {id: post.id},
            include: [{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User, /* 댓글 작성자 */
                    attributes: ['id', 'nickname']    
                }]
            },{
                model: User, /* 게시글 작성자 */
                attributes: ['id', 'nickname']
            },{
                model: User, /* 좋아요 누른 사람 */
                as: 'Likers',
                attributes: ['id']
            }]
        })
        res.status(201).json(fullPost)
    }catch(error){
        console.error(error)
        next(error)
    }
   
});

/*image가 postform의 append('image', f)와 같다 array(여러개), single(한개),
 none(텍스트),  fields(input이 여러 개 있을 때) */
 router.post('/images', isLoggedIn, upload.array('image'), (req, res, next) => { // POST /post/images
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
  });

/* 주소부분에서 동적으로 바뀌는 부분 => 파라미터  */
router.post('/:postId/comment',isLoggedIn ,async(req,res, next)=>{ /*  POST /post/1/comment */ 
    try {
      /* 서버쪽에서 꼼꼼한 검사 우선 포스트가 없는데 코멘트쪽에서 없는 포스트에 삭제를 요청할 수 도있다
       그래서 postId(게시글)을 찾은 후 조건을 걸어 그 게시글이있는지 확인 후 없다면 return을 보낸다. */
     const post =  await Post.findOne({
          where: {
              id: req.params.postId}   
      }) ;
      if(!post){
          return res.status(403).send('존재하지 않는 게시글입니다.')
      }
        /* 댓글을 보낸다. */
        const comment = await Comment.create({
            content: req.body.content,
            /* 파라미터 동적으로 생성 */
            PostId: parseInt(req.params.postId, 10),
            UserId: req.user.id
        })
        const fullComment = await Comment.findOne({
            where : {id: comment.id},
            include: [{
                model: User,
                attributes: ['id', 'nickname']
            }]
        })
        res.status(201).json(fullComment)
    }catch(error){
        console.error(error)
        next(error)
    }
   
})
/* 게시글 불러오는건 isLoiggedIn이 없어야한다 */
router.get('/:postId' ,async(req,res, next)=>{ /*  GET /post/1/ */ 
    try {
     
     const post =  await Post.findOne({
          where: {
              id: req.params.postId},
              /* include 이유:  */         
      }) ;
      if(!post){
          return res.status(403).send('존재하지 않는 게시글입니다.')
      }
     
     const fullPost = await Post.findOne({
         where: {id: post.id},
             include:[{
                model: Post,
                as: "Retweet",
                include: [{
                    model: User,
                    attributes: ['id','nickname']
                },{
                    model: Image,
                }]
            },{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id','nickname'],
              },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id','nickname']
                }]
            }]
     })
        res.status(201).json(fullPost)
    }catch(error){
        console.error(error)
        next(error)
    }
   
})

router.post('/:postId/retweet',isLoggedIn ,async(req,res, next)=>{ /*  POST /post/1/comment */ 
    try {
     
     const post =  await Post.findOne({
          where: {
              id: req.params.postId},
              /* include 이유:  */
              inclue:[{
                  model: Post,
                  as: 'Retweet'
              }]   
      }) ;
      if(!post){
          return res.status(403).send('존재하지 않는 게시글입니다.')
      }
      /* 자기 게시글을 리트윗 하는 거랑 자기게시글을 리트윗한 글을 자기가 다시 리트윗 하는 것*/
     if(req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)){
         return res.status(403).send('자신의 글은 리트윗할 수 없습니다.')
     }
     /* 다른사람의 글을 리트윗한 글을 내가 리트윗 하는 것 */
     const retweetTargetId = post.RetweetId || post.id;
     const exPost = await Post.findOne({
         where: {
             UserId: req.user.id,
             RetweetId: retweetTargetId,
         },
     })
     if(exPost){
         return res.status(403).send('이미 리트윗 했습니다.')
     }
     const retweet = await Post.create({
         UserId: req.user.id,
         RetweetId: retweetTargetId,
         content: 'retweet'
     })
     /* 어떤 게시글을 리트윗 했는지 */
     const retweetWithPrevPost = await Post.findOne({
         where: {id: retweet.id},
             include:[{
                model: Post,
                as: "Retweet",
                include: [{
                    model: User,
                    attributes: ['id','nickname']
                },{
                    model: Image
                }]
            },{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
              },{
                model: Image,
            },{
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id','nickname']
                }]
            }]
     })
        res.status(201).json(retweetWithPrevPost)
    }catch(error){
        console.error(error)
        next(error)
    }
   
})


router.patch('/:postId/like', isLoggedIn,async(req,res,next)=>{
    try{
        const post = await Post.findOne({
            where: {id: req.params.postId}
        })
        
        if(!post){
            return res.status(403).send('게시글이 존재하지 않습니다.')
        }
        await post.addLikers(req.user.id);
        res.json({PostId: post.id, UserId: req.user.id})
        /* 관계 메서드가 나온다. */
    }catch(error){
        console.error(error);
        next(error)
    }

})

router.delete('/:postId/like', isLoggedIn, async(req,res,next) =>{
    try{
        const post = await Post.findOne({
            where: {id: req.params.postId}
        })
        if(!post){
            res.status(403).send('게시글이 존재하지 않습니다.')
        }
        await post.removeLikers(req.user.id);
        res.json({PostId: post.id, UserId: req.user.id})
    }catch(error){
        console.error(error);
        next(error);
    }
})
router.delete('/:postId',isLoggedIn,async(req,res,next)=>{ /* /post */
    try{
    
     await Post.destroy({
        where: {
            id: req.params.postId,
            /* 내가 쓴 게시글이어야함 */
            Userid: req.user.id,
        }
    })
    res.status(200).json({ PostId: parseInt(req.params.postId, 10)})
    }catch(error){
        console.error(error)
        next(error);
    }
})
module.exports = router;