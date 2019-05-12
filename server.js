/* eslint-disable no-console */

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

/*DB connection setting*/
const mongoose = require('mongoose');
const db = mongoose.connection;
db.on('error',console.error);
db.once('open',()=>{
    console.log("DB connection good.");
});
mongoose.connect("mongodb://localhost/shinp_account"); // collection 이름은 shinp_account

/*middleware*/
app.use(express.static('public/views'));
app.use(express.static('public/scripts'));
app.set('views',__dirname+'/public/views');
app.engine('html',require('ejs').renderFile);

// bodyParser : HTTP에서 필요한 데이터만 뽑기 쉽게 해주는 middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.render('login.html');
});

// RESTful API - api/todo.js에 있는 api들을 사용합니다
const accountAPI = require('./routes/account.js');

// http://localhost:8000/account/~ 로 들어오는 모든 요청은 이제 accountAPI가 처리해줍니다 
app.use('/account',accountAPI);

const server = app.listen(8000, () => {
    console.log('server is running at port 8000');
});