// routes/home.js

const express = require('express');
const router = express.Router();

// Home

router.get('/',(req,res) => {
    if(req.session.logined){
        res.render('home.html',{id:req.session.user_id});
    } else {
        res.render('login.html');
    }
    
});

router.get('/login',(req,res)=>{
    res.render('login.html');
});

router.get('/register', (req,res) => {
    res.render('register.html');
});

router.get('/home', (req,res) => {
    res.render('home.html');
});

module.exports = router;