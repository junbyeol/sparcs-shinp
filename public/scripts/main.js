/* eslint-disable no-undef */
/* eslint-disable no-console */
/* public/scripts/main.js */

//const axios = require('axios');

console.log('start');

// eslint-disable-next-line no-undef

function loadLoginedID(){
    const targetText = document.getElementById('login-status-loginedID');
    
    axios.post('/')
        .then((res)=>{
            console.log(res);
            targetText.innerHTML = res.body.id;
        })
        .catch((err)=>{
            console.log(err);
        });
    //targetText.innerHTML = getJSessionId();
}

function goToHome(){
    const id = document.getElementById(idInput).value;
    document.getElementById(loginForm).submit();
}

function loadGrouplist(){
    axios.get('http://localhost:8000/account/retrive')
        .then((res)=> {
            const groups = res.data.groupList;
            for(let i=0;i<groups.length;i++){
                addGrouplist(groups[i]);
            }
            addGrouplist({groupName:"+ 새 그룹 추가", groupId:"add"});
        })
        .catch((err)=>{
            console.log(err);
        });
}

function addGrouplist(val){
    var group = document.createElement('li');
    group.id = `grouplist-${val.groupId}`;

    group.innerHTML = `<div class="grouplist">${val.groupName}</div>`;
    console.log(group);
    document.getElementById('grouplist-ul').appendChild(group);
}