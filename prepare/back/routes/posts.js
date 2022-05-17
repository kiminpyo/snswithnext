const express= require('express');
const router = express.Router();
const { Op} = require('sequelize')

const {Post, User, Image, Comment} = require('../models')
router.get('/', async(req,res,next) =>{ /* GET /posts */
 try{
   const where = {}
   if(parseInt(req.query.lastId,10)){ /* 초기 로딩이 아닐 때  */
     /* [Op.lt] =연산자 operator */
      where.id= {[Op.lt]: parseInt(req.query.lastId,10)}
   }
  const  posts = await Post.findAll({
    where,
    /* 게시글의 제한 ==> findAll =다찾아라. 근데 limit:10으로 10개만 찾아라 어디서 부터? offset: 0*/  
    
    limit: 10,
    /* offset: 0, */
    /* order은 정렬순서, 최신게시글부터 가져올때, DESC  <=> ASC 
    게시글을 정렬하고 댓글을 닷 ㅣ정렬 */
    order: [['createdAt', 'DESC'],
    [Comment, 'createdAt', 'DESC']],
    include: [{
        model: User,
        attributes: ['id','nickname']
    },{
        model:Image,
    },{
      model: Comment,
      include: [{
        model: User,
        attributes: ['id','nickname'],
      }]
    }, {
        model: User,
        as: 'Likers',
        attributes: ['id']
    },{
      model: Post,
      as: "Retweet",
      include: [{
          model: User,
          attributes: ['id','nickname']
      },{
          model: Image
      }]
  }]
  });
  console.log(posts)
    res.status(200).json(posts)
 }catch(error){
    console.error(error)
 }
   
});

module.exports = router;