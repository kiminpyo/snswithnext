const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
/* 모델의 유저 정보를 담아온다. */
const {Op } = require ('sequelize');
const {User, Post, Image, Comment} = require('../models');
/* 미들웨어를 새로 생성해서 밑에다가 로그인, 로그아웃상황에 마다 사용해준다. */
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const db = require('../models');

const router = express.Router();

/* 로그인 계속 할수있게끔 작업 */
router.get('/', async(req, res, next) =>{
    console.log(req.header)
    try {
        /* 사용자가 있으면 */
        if(req.user){
            const fullUserWithoutPoassword = await User.findOne({
                where: {id: req.user.id},
                attributes:{
                    exclude: ['password']
                },
                include: [{
                    model: Post,
                    attributes:['id'],
                },{
                    model: User,
                    as: 'Followings',
                    attributes:['id'],
                },{
                    model: User,
                    as: "Followers",
                    attributes:['id'],
                }]
            })

            res.status(200).json(fullUserWithoutPoassword)
        }else{
            res.status(200).json(null)
        }
    }catch(error){
        console.error(error)
        next(error);
    }

})

    /* 로그인 전략 앞서 만든 passport를 여기서 사용  + 매개변수 3개 이름*/
    router.post('/login', isNotLoggedIn,(req, res, next) =>{
        
        /* router나 app에 붙는 애들은 미들웨어 (passport는 기본적으로 req,res ,next를 쓸수없는 미들웨어다) */
        passport.authenticate('local', (err, user, info)=>{
            if(err){
                /* 서버에러 */
                console.error(err);
                return next(err)
            }
            if(info){
                /* 403은 금지 401은 잘못됐다 */
                return res.status(401).send(info.reason)
            }
  
            return req.login(user, async(loginErr)=>{
                if(loginErr){
            /* 혹시나 passport 로그인이 에러가 나면 */
                    console.error(loginErr)
                    return next(loginErr);
                }
                /* following 관련한 데이터는 없다. 
                attributes: 모델에서 원래 id에 있는 6개의 데이터를 다 전달해준다. 그 중에서 고를 수 가 잇다.
                => 비밀번호 제외시킨다. 
                 include를 모델에서 필요한 애들을 불러와포함시킨다. */
                const fullUserWithoutPoassword = await User.findOne({
                    where: {id: user.id},
                    attributes:{
                        exclude: ['password']
                    },
                    include: [{
                        model: Post,
                        attribute: ['id']
                    },{
                        model: User,
                        as: 'Followings',
                        attribute: ['id']
                        
                    },{
                        model: User,
                        as: "Followers",
                        attribute: ['id']
                    }]
                })
                /* 사용자정보를 프론트로 넘긴다 */
                /* 쿠키를 쓰면 res.setHeader('Cookie',''랜덤한 문자')같은 정보를 보내준다 */
                /* 서버쪽에서 통째로 들고있는 것은 세션=> 사용자 정보가 많을수록 메모리가 커진다
                -> 그래서 passport쪽에서 id만 들고있어야겠다는 생각 => db에서1번id만 찾는 구조 
                로그인은 복잡한 구조다. 나중에는 아예 세션 저장용 db로 redis를 쓴다*/
                return res.status(200).json(fullUserWithoutPoassword);
            })/* 여기서는 user 사가에서는 action.data 리듀서는 me */
        })(req, res, next)
    });


router.post('/signup',isNotLoggedIn,async(req, res, next)=>{ /* POST /user */
    
    try {
        /* db에서 하나 찾아보는거 비동기인지 아닌지는 공식문서로 찾아봐야한다. */
        const exUser = await User.findOne({
            /* 조건 */
            where: {
                /* 기존에 저장된 사용자가 있는지 */
                email: req.body.email,
            }
        });
        /* 이미 사용자가 있으면 */
        if(exUser){
            /* return안붙이면 밑에 거 실행됨. 결국 및에 res.send까지 두번 보내버리는 셈 */
            /* status(403)은 상태코드와 바디(데이터)를 보낼 수 있다. */
          return  res.status(403).send('이미 사용 중인 아이디입니다.')
        }
/* bycrpt로 hash화(암호화)하는과정, 2번째 인자에는 해쉬길이 ==> 해킹에 힘들지만, 서버가 느려진다. (적절한 숫자 찾기)*/
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    /* sync라서 await을 붙여라 ==> 안쓰면 User.create는 원래 비동기라 res가 먼저 실행되기때문에 동기를 넣어라 */
            await User.create({
        /* 테이블안에 데이터를 넣는 과정 */
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword
        })
        /* cors 에러 포트에 *를하면 모든 서버 */
      /*   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000') */
        
      /* 요청에 대한 성공적인 응답이라면  */
        res.status(200).send('ok')
    }catch(error){
        console.log(error);
        next(error)  /* status 500 ==> 서버에러 */
    } 
});



router.post('/logout',isLoggedIn, (req,res,next)=>{
    res.redirect('/');
   console.log(req.user)
   req.session.destroy();
   res.send('ok');
});

router.patch('/nickname', isLoggedIn,  async(req,res,next) =>{
 try{
    await User.update({
        nickname: req.body.nickname,
    },{ 
        /* 조건: 내 아이디에서 받은  */
        where: {id: req.user.id}
    })
    res.status(200).json({nickname: req.body.nickname})
}catch(error){
    console.error(error);
    next(error);
}
})

   router.get('/followers', isLoggedIn,  async(req,res,next) =>{
    try{
        const user = await User.findOne({
            /* 나 */
            where:{id : req.user.id}
        })
        if(!user){
            res.status(403).send('없는 사람을 팔로우 하려고 하시네요')
        }
       const followers = await user.getFollowers({
           limit: parseInt(req.query.limit, 10),
       })
       res.status(200).json(followers)
   }catch(error){
       console.error(error);
       next(error);
   }
   })

   router.get('/followings', isLoggedIn,  async(req,res,next) =>{
    try{
        const user = await User.findOne({
            where:{id : req.params.userId}
        })
        if(!user){
            res.status(403).send('없는 사람을 팔로우 하려고 하시네요')
        }
        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followings)
   }catch(error){
       console.error(error);
       next(error);
   }
   })

   /* 그 사람이 나를 끊는 거랑 내가 그 사람을 끊는 거랑 같다  */
   router.delete('/follower/:userId', isLoggedIn,  async(req,res,next) =>{
    try{
        const user = await User.findOne({
            where:{id : req.params.userId}
        })
        if(!user){
            res.status(403).send('없는 사람을 차단하려고 하시네요')
        }
        await user.removeFollowings(req.user.id);
        /* userId가 action.data가 된다. */
       res.status(200).json({UserId: parseInt(req.params.userId,10)});
   }catch(error){
       console.error(error);
       next(error);
   }
   })
 
router.get('/:userId', async (req, res, next) => { // GET /user/1
    try {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.params.userId },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Post,
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followings',
          attributes: ['id'],
        }, {
          model: User,
          as: 'Followers',
          attributes: ['id'],
        }]
      })
      if (fullUserWithoutPassword) {
        const data = fullUserWithoutPassword.toJSON();
        data.Posts = data.Posts.length; // 개인정보 침해 예방
        data.Followers = data.Followers.length;
        data.Followings = data.Followings.length;
        res.status(200).json(data);
      } else {
        res.status(404).json('존재하지 않는 사용자입니다.');
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  router.get('/:userId/posts', async (req, res, next) => { // GET /user/1/posts
    try {
      const where = { UserId: req.params.userId };
      console.log(req.query.lastId)
      if (parseInt(req.query.lastId, 10)) { // 초기 로딩이 아닐 때
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
      } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
      const posts = await Post.findAll({
        where,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Image,
        }, {
          model: Comment,
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
            order: [['createdAt', 'DESC']],
          }],
        }, {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        }, {
          model: Post,
          as: 'Retweet',
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }, {
            model: Image,
          }]
        }],
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
 
  router.patch('/:userId/follow', isLoggedIn,  async(req,res,next) =>{
    try{
        const user = await User.findOne({
            where:{id : req.params.userId}
        })
        if(!user){
            res.status(403).send('없는 사람을 팔로우 하려고 하시네요')
        }
        await user.addFollowers(req.user.id);
       res.status(200).json({UserId: parseInt(req.params.userId,10)});
   }catch(error){
       console.error(error);
       next(error);
   }
   })


   router.delete('/:userId/follow', isLoggedIn,  async(req,res,next) =>{
    try{
        const user = await User.findOne({
            where:{id : req.params.userId}
        })
        if(!user){
            res.status(403).send('없는 사람을 팔로우 하려고 하시네요')
        }
        await user.removeFollowers(req.user.id);
        /* userId가 action.data가 된다. */
       res.status(200).json({UserId: parseInt(req.params.userId,10)});
   }catch(error){
       console.error(error);
       next(error);
   }
   })

module.exports = router;