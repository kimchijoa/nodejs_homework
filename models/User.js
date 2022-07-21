const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //암호화에 필요한 salt는 10글자
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //해당값의 스페이스값( " " )를 없앰
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    p_image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//유저 정보를 저장하기전에 실행함
userSchema.pre('save', function (next) { //여기서는 익명함수를 사용하면 안됬다. 왜 그럴까?
    let user = this;

    if(user.isModified('password')) { //조건 중 password를 변경하거나 생성할때만 적용되게 수정
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
            //myPlaintextPassword는 암호화하기 전 사용자가 입력한 비밀번호다
            bcrypt.hash(user.password , salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err)
                //에러가 나지 않았다면 hash 암호화된 값을 사용자 DB에 저장할 준비
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

//유저 정보를 받아와서 존재하는 pw인지 비교
userSchema.methods.comparedPassword = function(plainPassword, cb_f) {
    //plainPassword = 입력한 pw, cb = db 내용
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb_f(err)
        cb_f(null, isMatch)
    })
}

//유저 토큰 발급
userSchema.methods.generateToken = function(cb_f) {
    let user = this;
    let token = jwt.sign(user._id.toHexString(), 'secretToken' )
    user.token = token
    user.save(function(err, user) {
        if(err) return cb_f(err)
        cb_f(null, user)
    })
}

//클라이언트 토큰 복호화 및 검증
userSchema.statics.findByToken = function(token, cb_f) {
    let user = this;
    jwt.verify(token, 'secretToken', function(err, decoded){
        //유저 아이디 이용해서 유저 찾고, 클라이언트 token 값을 비교하여 일치하는지 확인
        user.findOne({ "_id":decoded, "token": token}, function(err, user){
            if(err) return cb_f(err);
            cb_f(null, user)
        })
    })
}

const User = mongoose.model('User',userSchema)

module.exports = { User } //해당 스키마를 다른 파일에서도 사용 가능