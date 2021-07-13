const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const { User } = require("./models/User");

//bodyParser option
//application/x-www-form-urlencoded 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));
//application.json 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://junghyun:wjdgus002@boiler-plate.eijjc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})