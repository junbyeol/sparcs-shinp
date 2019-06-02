/* eslint-disable no-console */
const express = require('express');
const account = require('../models/account').account;
const group = require('../models/account').group;
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
            newAccount.name= req.body.name;
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

    account.findOne({id:req.body.id}, (err,user)=> {
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
                return res.redirect('/home');
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

router.post('/logout',(req,res)=>{
    req.session.destroy();
    return res.redirect('/home');
});

router.get('/retriveAccount', (req, res) => {
    account.findOne({id:req.query.id},(err,schemas) => {
        if(err) {
            console.log(err);
            res.status(500).end('DB Error');
        }
        return res.json(schemas);
    });
});

router.get('/retriveGroup',(req,res)=>{
    group.findOne({groupId: req.query.id}, (err,schemas)=>{
        return res.json(schemas);
    });
});

router.post('/groupAdd', (req,res) => {
    console.log(req.body);
    /* 이미 존재하는 ID인지 확인*/
    group.findOne({groupId: req.body.groupId}, (err,user)=>{
        if(err){
            console.log(err);
            return res.redirect('/error');
        } 
        else if (user !== null ) {
            console.log('Group with same ID already exists');
            return res.redirect('/');
        }
        else {
            //login 
            const newGroup = new group();
            newGroup.groupName = req.body.groupName;
            newGroup.groupId = req.body.groupId;
            newGroup.groupInfo = req.body.groupInfo;

            newGroup.groupMeetings.sun = req.body.sun;
            newGroup.groupMeetings.mon = req.body.mon;
            newGroup.groupMeetings.tue = req.body.tue;
            newGroup.groupMeetings.wed = req.body.wed;
            newGroup.groupMeetings.thu = req.body.thu;
            newGroup.groupMeetings.fri = req.body.fri;
            newGroup.groupMeetings.sat = req.body.sat;
            
            newGroup.groupMembers = req.body.members.split('.');
            newGroup.groupMembers.pop();

            newGroup.save((err) => {
                if(err) {
                    console.log(err);
                    return res.redirect('/home');
                }
                console.log('good database created');
                console.log(newGroup);
                
                newGroup.groupMembers.forEach((loginAccount)=>{
                    account.findOne({id: loginAccount}, (err,user) => {
                        if(err){
                            console.log(err);
                            return res.redirect('/error');
                        } else if(!user){
                            return res.redirect('/error');
                        }
                        else {
                            user.groupList.push({
                                groupName: req.body.groupName, 
                                groupId: req.body.groupId
                            });
                            user.save((err) => {
                                if(err) {
                                    console.log(user);
                                    console.log(err);
                                    return res.redirect('/home');
                                }
                            });
                        }
                    });
                });
                console.log('database pushed well');
                return res.redirect('/home');
            });
            
        }
    });
});

router.post('/groupUpdate', (req,res) => {
    /* 이미 존재하는 ID인지 확인*/
    console.log('update start');
    group.findOne({groupId: req.body.groupId}, (err,schema)=>{
        if(err){
            console.log(err);
            return res.redirect('/error');
        } 
        else if (schema === null ) {
            console.log(`Your group is gone!:${req.body.groupId}`);
            return res.redirect('/error');
        }
        else {
            schema.groupName = req.body.groupName;
            schema.groupInfo = req.body.groupInfo;

            schema.groupMeetings.sun = req.body.sun;
            schema.groupMeetings.mon = req.body.mon;
            schema.groupMeetings.tue = req.body.tue;
            schema.groupMeetings.wed = req.body.wed;
            schema.groupMeetings.thu = req.body.thu;
            schema.groupMeetings.fri = req.body.fri;
            schema.groupMeetings.sat = req.body.sat;

            schema.groupMembers = req.body.members.split('.');
            schema.groupMembers.pop();

            schema.save((err) => {
                if(err) {
                    console.log(err);
                    return res.redirect('/home');
                }
                console.log('good database updated');
                console.log(schema);
                schema.groupMembers.forEach((loginAccount)=>{
                    account.findOne({id: loginAccount}, (err,user) => {
                        if(err){
                            console.log(err);
                            return res.redirect('/error');
                        } else if(!user){
                            return res.redirect('/error');
                        }
                        else {
                            user.groupList.push({
                                groupName: req.body.groupName, 
                                groupId: req.body.groupId
                            });
                            user.save((err) => {
                                if(err) {
                                    console.log(user);
                                    console.log(err);
                                    return res.redirect('/home');
                                }
                            });
                        }
                    });
                });

                return res.redirect('/home');
            });
            
        }
    });
});

router.post('/groupOut',(req,res)=>{
    account.findOne({id:req.body.user},(err,userSchema)=>{
        if(err){
            console.log(err);
        } else {
            let groupList = userSchema.groupList;
            let tmpArray = [];
            const idx = tmpArray.map((e)=>{return e.groupId;}).indexOf(req.body.group);
            groupList.splice(idx,1);
            userSchema.groupList = groupList;
            console.log(userSchema.groupList);

            userSchema.save((err)=>{
                if(err){
                    console.log(err);
                    return res.redirect('/home');
                }
                group.findOne({groupId: req.body.group},(err,groupSchema)=>{
                    if(err) {
                        console.log(err);
                    } else {
                        let memberList = groupSchema.groupMembers;
                        const idx = memberList.indexOf(req.body.user);
                        memberList.splice(idx,1);
                        groupSchema.groupMembers = memberList;
                        console.log(groupSchema.groupMembers);
            
                        if(memberList.length === 0) {
                            groupSchema.deleteOne({groupId: req.body.group},(err)=>{
                                if(err){
                                    console.log(err);
                                    return res.redirect('/home');
                                }
                                console.log('group successfully delete!');
                                return res.redirect('/home');
                            });
                        } else {
                            groupSchema.save((err)=>{
                                if(err){
                                    console.log(err);
                                    return res.redirect('/home');
                                } 
                                return res.redirect('/home');
                            });
                        }
                    }
                    
                });
            });
        }

    });
});

module.exports = router;
