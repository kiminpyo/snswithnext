const passport = require('passport');
const {User} = require('../models')
const local = require('./local');
module.exports = () =>{
    /*routes에 user에 있는 return값  req.login의 정보가 들어간다. */
    passport.serializeUser((user, done )=>{
        /* 유저 정보 중에서 쿠키랑 묶어줄 id만 저장하는 것 여기서 모든 정보를 들고오면 메모리가 크다 */
        done(null, user.id);
    });
    /* 위에서 id를 저장햇고,  models에 있는 모든 user정보에서 
    id가 일치하는 놈에 대한 user정보를 복구해낸다. */
    passport.deserializeUser( async(id, done)=>{
        try {
            const user = await User.findOne( {
                where: {id}
            })   
            done(null, user)  /* req.user 안에 넣어준다. */
        }catch(error){
            console.error(error);
            done(error)
        }

    
    });

    local();
}