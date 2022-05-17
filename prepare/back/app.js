const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser')
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan')
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postsRouter = require('./routes/posts')
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag')
const db = require('./models');
const passportConfig = require('./passport')

dotenv.config();
const app = express();
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();

/* 얘네는 passport의 시리얼라이즈 디시리얼 라이즈 를 실행시킨다.  app.js는 중앙 관리소라고 보면됨*/
/* 개발모드랑 배포모드일떄 다르다 => 이유? */
if(process.env.NODE_ENV === 'production'){
  app.use(morgan('combined'))
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ 
    /* 쿠키 관련  */
    origin: ['http://localhost:3060', 'http://13.209.67.255'],
    credentials: true,
    
}))
}else{
  app.use(morgan('dev'));
  app.use(cors({
    origin: true,
    credentials: true,
  }));
}

/* 조회수 1올리는거나 뭔가애매한 것들은 post를 써라 
 get,post,put,delete를 정확히 지키는 것이 resAPI인데,
 정확히 지키기는 어렵다. 어느정도 선에서 합의를 타협한다.
 예를 들면 애매한건 post로 하자 
 */
/* cors에러 잡는데, */

/* 경로구분자가 운영체제에 맞게 문제가 되기때문에  */
app.use('/images',express.static(path.join(__dirname, 'uploads')))
 /* 미들웨어(여기)는 순서대로 실행된다. */
 /* 프론트에서 보낸 데이터를 req.body로 넣어주는 역할, post나 router보다 위에 있어야한다 이 위치. 
  프론트에서 데이터를 보냈을때 json()형태로 넣어주고 -> form submit했을 때 urlencoded로 formdata받는다*/
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/* 로그인 처리가 서버에서 다된 후 과정 (쿠키 or 세션처리를 위한 미들웨어 )*/
/* cookie도 secret */
app.use(cookieParser( process.env.COOKIE_SECRET));
app.use(session({
     /* 나중에 다시 찾아보기 */
     saveUninitialized: false,
     resave: false,
     /* secret이 해킹당하면 복원이 되어서 숨겨놔야한다. */
     secret: process.env.COOKIE_SECRET,
     cookie: {
      httpOnly: true,
      secure: false,
      domain: process.env.NODE_ENV === 'production' && '.nodebird.com'
    },
}));
app.use(passport.initialize());
app.use(passport.session());
/* url과 method (req,res)*/
/* 주소창에 치는 것 get */
app.get('/',(req, res)=>{
    res.send('hello express')
})


app.use('/posts', postsRouter)
app.use('/post',postRouter)
app.use('/user', userRouter)
app.use('/hashtag', hashtagRouter)

/* 기본적으로 내부적으로 존재하는 err 미들웨어 
에러상황에 따라 뭔가를 바꾸고 싶으면 따로 만들어준다.*/
app.use((err,req,res,next) =>{

})

app.listen(80, ()=>{
    console.log('서버 실행 중!')
});