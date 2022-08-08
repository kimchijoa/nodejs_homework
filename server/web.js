const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./models/User');
const config = require('./config/key');
const { auth } = require('./middleware/auth');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');

mongoose.connect(config.mongoURI , {
  //useNewUrlParser: true, useUnifiedToplogy: true, userCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch((error)=> { console.log(error)})

app.get('/', (req, res) => {
  res.send('Hello World! 잘되닝?')
})

app.post('/api/users/register',(req, res)=>{
  //회원가입 필요 정보
  const user = new User(req.body) // json 형식으로 데이터 받음
  //save 전에 pw 암호화
  user.save((err, userInfo) =>{ // 몽고 DB 함수
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  }) 
})

app.post('/api/users/login',(req, res)=> {
  //1. 요청된 이메일을 DB에서 조회함
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "해당 이메일에 해당하는 유저가 없습니다."
      })
    }
    console.log("pass01")
    //2. 요청한 이메일이 있다면 PW가 일치하는지 확인한다.
    user.comparedPassword(req.body.password, (err, isMatch) =>{
      if(!isMatch)
      return res.json({ loginSuccess: false,
        message: "비밀번호가 일치하지 않습니다."
      })
      console.log("pass02")
      //3. 1,2 단계가 성공한다면 토큰을 생성한다.
      user.generateToken((err, user)=>{
        if(err) return res.status(400).send(err);
        //토큰을 사용자 브라우저 localstorage에 저장
        //현재는 쿠키에 저장
        console.log("HI~")
        res.cookie("x_auth",user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })

})

//로그인 유저 검증
app.get('/api/users/auth', auth, (req,res) => {
  //
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.role === 0 ? false : true 
  })
})

//유저 로그아웃
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id}, { token: "" } ,(err, user) =>{
      if(err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})