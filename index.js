const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const { User } = require('./models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://kkh:rnjrnjwm12@runreact.z4yqk23.mongodb.net/?retryWrites=true&w=majority', {
  //useNewUrlParser: true, useUnifiedToplogy: true, userCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch((error)=> { console.log(error)})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register',(req, res)=>{
  //회원가입 필요 정보
  const user = new User(req.body) // json 형식으로 데이터 받음
  user.save((err, userInfo) =>{ // 몽고 DB 함수
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  }) 
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})