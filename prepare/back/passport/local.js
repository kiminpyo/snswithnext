const passport = require('passport');;
/*localStrategy는 변수를 바꾼 것, 카카오와 구글도 local에 저장할 수 있기때문에 변수를 잘 설정*/
const { Strategy: LocalStrategy} = require('passport-local')
/*  암호를 비교하기 위해 */
const bcrypt = require('bcrypt');
/* 모델에 유저정보를 찾기위해 */
const {User} = require('../models')
/* 얘는 paossport의 index의 local()에서 실행된다. */
module.exports =() =>{
    passport.use(new LocalStrategy({
        /* 실제 보내는 값들 */
        usernameField : 'email',
        passwordField: 'password',
    }, async (email, password,done )=>{
        /* 비동기 요청시 에러가 발생할 수 있어 await같은경우는 try로 감싼다 */
        try {
            const user = await User.findOne({
                where:{email}
            })
            /* 유저가 아니면 */
            if(!user){
                /* done은 콜백과 같은 것 */
                /* 첫번째인자 서버에러(일단 null로 넘겨준다 이유: 비동기 요청시 서버에러가 발생할 수 있다)
                , 2번째인자 성공여부에 따라 데이터를 넘길지 말지,
                 3번째인자 클라이언트 에러 (사용자 없는 데 로그인 할때)*/
               return  done(null,false, {reason: '존재하지 않는 사용자 입니다.'})
            }
            const result = await bcrypt.compare(password, user.password)
            /* 비밀번호 일치할 때 */
            if(result){
                /* 2번째 true => 사용자 정보 넘겨준다. */
                return done(null,user)
            }
            /* 비밀번호가 틀렸을 때 */
            return done(null,false, {reason: '비밀번호가 틀렸습니다'})
        }catch(error){
            console.error(error);
            /* 서버에러일때 */
            return done(error)
        }
     
    }));
}