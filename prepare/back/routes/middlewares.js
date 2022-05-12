exports.isLoggedIn = (req,res, next) =>{
    if(req.isAuthenticated()){
        /* next의 사용 방법 2가지, 안에 뭘 넣으면 err처리하러 가고, 
        그냥 매개변수없이 next()로 되면 다음 미들웨어로 간다. */
        next();
    }else{
        res.status(401).send('로그인이 필요합니다.')
    }
}
exports.isNotLoggedIn = (req,res, next) =>{
    if(!req.isAuthenticated()){
        
        next();
    }else{
        res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.')
    }
}