/* eslint-disable no-console */
const express = require('express');
const account = require('../models/account');
const router = express.Router();
const crypto = require("crypto");


//create: 회원가입
router.post('/add', (req,res) => {
    /*DB 탐색 전 error 점검*/
    if(req.body.id ==="" || req.body.password ===""){
        console.log("sign up: null input error");
        return res.send(`
        <script type='text/javascript'>
          alert('sign up error: null input error');
          window.location.href = '/register';
        </script>
      `);
    }

    if(req.body.pw !== req.body.pwCheck){
        console.log("sign up: pw is diff with pwcheck");
        return res.send(`
        <script type='text/javascript'>
          alert('sign up error: password is different with password(again)');
          window.location.href = '/register';
        </script>
        `);
    }

    /* 이미 존재하는 ID인지 확인*/
    account.findOne({id: req.body.id}, (err,user)=>{
        if(err) return res.redirect('/register');
        else if (user !== null ) {
            console.log('ID already exists');
            return res.redirect('/register');
        }
        else {
            const newAccount = new account();
            newAccount.id = req.body.id;
            
            const inputPw = req.body.pw;
            const salt= Math.round((new Date().valueOf()*Math.random()))+"";
            newAccount.pw = crypto.createHash("sha512").update(inputPw+salt).digest("hex");
            newAccount.salt = salt;

            newAccount.save((err) => {
                if(err) {
                    console.log(err);
                    return res.redirect('/register');
                }
                console.log('good database created');
                /*
                res.send(`
                    <script type='text/javascript'>
                    alert('register suceed!: login now');
                    </script>
                `);
                */
                return res.redirect('/login');
            });
        }
    });
});

//retrieve: 로그인
router.post('/login', (req,res) => {
    if(req.body.id === "" || req.body.pw==="" ) {
        console.log("login error: null input error");
        return res.send(`
        <script type='text/javascript'>
          alert('login error:null input error');
          window.location.href = '/login';
        </script>
        `);
    }

    account.findOne({"id":req.body.id}, (err,user)=> {
        if(err){    
            console.log(err);
            return res.send(`
            <script type="text/javascript">
              alert('login error');
              window.location.href = '/login';
            </script>
            `);
        } else if (!user) {
            console.log('login: id does not exist');
            return res.send(`
            <script type="text/javascript">
              alert('login failed: id does not exist');
              window.location.href = '/';
            </script>
            `);
        } else {
            const hashedPW = crypto.createHash("sha512").update(req.body.pw+user.salt).digest("hex");
            if(hashedPW === user.pw) {
                req.session.user_id = req.body.id;
                req.session.logined = true; 

                console.log('login succeed:'+req.body.id);
                return res.redirect('/');
            } else {
                console.log('login: id does not exist');
                return res.send(`
                <script type="text/javascript">
                  alert('login failed: password is not correct');
                  window.location.href = '/login';
                </script>
                `);
            }
        }
    });
});

module.exports = router;




