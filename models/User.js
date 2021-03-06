const mongoose = require('mongoose');

/**
 * 비밀번호 암호화
 */
const bcrypt = require('bcrypt');
//saltRounds(Salt 가 몇글자인지) -> Salt 를 먼저 생성 -> 이를 이용해서 비밀번호를 암호화해야 한다. 
const saltRounds = 10;

/**
 * token 생성하기
 */
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 100
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//index.js 에서 user.save 를 하기 전에 무언가를 한다는 것을 명시함
//여기서는 비밀번호 암호화 => 비밀번호를 바꿀 때만 암호화 해야한다.
userSchema.pre('save', function(next){
    //userSchema 안에 있는 데이터를 나타냄
    var user = this;

    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다. 
        bcrypt.genSalt(saltRounds, function(err, salt){
            //에러가 나오면 index.js 의 user.save 로 이동
            if (err) return next(err)

            //에러가 없다면
            bcrypt.hash(user.password, salt, function(err, hash){
                //에러가 나오면 index.js 의 user.save 로 이동
                if (err) return next(err)

                //에러가 없다면
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 와 암호화된 비밀번호가 같은지 check
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;
    
    //jsonwebtoken 을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(),  'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = token
    user.save(function(err, user) {
        if (err) return cb(err)
        cb(null, user)
    })

}

const User = mongoose.model('User', userSchema)
module.exports = {User} //다른 곳에서도 사용할 수 있도록 export
