const { User } = require('../models/User')

let auth = (req, res, next) => {
    //클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;
    User.findByToken(token, (err, user)=>{
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next(); // 미들웨어에서 다음 상태로 진행할수있게 하기위해
        // user안에 선언된 next를 다시 선언해줌
        // req 값에 token, user를 다시 넣어주는 이유는 이동한 다음 페이지에서도
        // 토큰 정보와 유저정보를 계속 들고있어야 하기 때문이다.
    })

}

module.exports = { auth };