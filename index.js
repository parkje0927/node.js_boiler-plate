const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");

const config = require('./config/key');


//bodyParser option
//application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));
//application.json 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());
//cookieParser
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('Mongo DB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요')
})

//route 만들기
//bodyParser 를 통해 client 에서 보내주는 회원가입 정보들을 가져오면, 
//그것들을 데이터베이스에 넣어준다.
app.post('/register', (req, res) => {
  const user = new User(req.body)

  user.save((err, doc) => {
    //에러 발생 시 client 에게 에러가 있다고 json 형식으로 전달
    if (err) return res.json({ success: false, err})
    
    //성공 시
    return res.status(200).json({
      success: true
    })
  })
})

//login route
app.post('/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다. 
  User.findOne({email: req.body.email}, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일레 해당하는 유저가 없습니다."
      })
    }

    //데이터 베이스에서 요청한 이메일이 있다면 비밀번호가 같은지 확인한다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false, message: "비밀번호가 틀렸습니다."
        })
      
      //비밀번호까지 같다면 Token 을 생성한다. 
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //token 을 저장한다. 어디에? 쿠키, 로컬스토리지 등에 저장 가능하다.
        //cookie 에 저장하는 법
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})

      })
    })

  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})