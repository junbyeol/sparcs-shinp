/* eslint-disable no-undef */
/* eslint-disable no-console */
/* public/scripts/main.js */

//const axios = require('axios');

console.log('start');

// eslint-disable-next-line no-undef

function loadLoginedID(){
    const targetText = document.getElementById('login-status-loginedID');
    
    axios.post('/getSession')
        .then((res)=>{
            console.log("res");
            console.log(res);
            document.getElementById(login-status-loginedID).innerHTML = res.session;
        })
        .catch((err)=>{
            console.log("err");
            console.log(err);
        });
    //targetText.innerHTML = getJSessionId();
}

function goToHome(){
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
    document.getElementById('grouplist-ul').appendChild(group);
}

function dayCellClicked(id){
    var color = document.getElementById(id).style.backgroundColor;
    color = "skyblue";
    console.log(color);
}