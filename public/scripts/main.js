/* eslint-disable no-undef */
/* eslint-disable no-console */
/* public/scripts/main.js */

//const axios = require('axios');

console.log('start');

// eslint-disable-next-line no-undef

function loadLoginedID(){ 
    ///////////////////////////////////////////////////////////
    axios.post('/getSession')
        .then((res)=>{
            document.getElementById('login-status-loginedID').innerHTML = res.session;
        })
        .catch((err)=>{
            console.log(err);
        });
    //////////////////////////////////////////////////////
}

function loadGrouplist(){
    axios.get('/account/retrive')
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

function checkboxClicked(id){
    var chkbox = document.getElementById(id);
    chkbox.value = chkbox.checked;
}