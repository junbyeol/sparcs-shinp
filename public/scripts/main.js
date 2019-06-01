/* eslint-disable no-undef */
/* eslint-disable no-console */
/* public/scripts/main.js */

console.log('start');

// eslint-disable-next-line no-undef

function loadPage(){

    document.getElementById('calendar').style.display = 'none';
    document.getElementById('groupAdd').style.display = 'none';
    document.getElementById('groupUpdate').style.display = 'none';

    //loadLoginedID();
    axios.post('/getSession')
        .then((res)=>{
            document.getElementById('login-status-loginedID').innerHTML
         = res.data.id;
        })
        .catch((err)=>{
            console.log(err);
        });
    //loadGrouplist();
    axios.get('/account/retriveLoadGroups')
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
    let group = document.createElement('li');

    group.innerHTML = `<div class="grouplist" id="grouplist-${val.groupId}" onclick="groupListClicked('${val.groupId}')">${val.groupName}</div>`;
    document.getElementById('grouplist-ul').appendChild(group);
}

function groupListClicked(groupId){
    if(groupId!=="add") {
        
        //중앙판넬 수정
        document.getElementById('calendar').style.display = 'flex';
        document.getElementById('groupAdd').style.display = 'none';
        document.getElementById('groupUpdate').style.display = 'none';

        //왼쪽 위 정보판넬 수정
        document.getElementById('info-placeholder').style.display ='none';
        document.getElementById('info-content').style.display = 'flex';

        axios.get('/account/retriveGroupInfo',{
            params: {
                id: groupId
            }
        })
            .then((res)=>{
                document.getElementById('info-content-groupName').innerHTML = res.data.groupName;
                document.getElementById('info-content-groupId').innerHTML = res.data.groupId;
                document.getElementById('info-content-groupInfo').innerHTML = res.data.groupInfo;
                var day ='';
                if(res.data.groupMeetings.sun) day +='일 ';
                if(res.data.groupMeetings.mon) day +='월 ';
                if(res.data.groupMeetings.tue) day +='화 ';
                if(res.data.groupMeetings.wed) day +='수 ';
                if(res.data.groupMeetings.thu) day +='목 ';
                if(res.data.groupMeetings.fri) day +='금 ';
                if(res.data.groupMeetings.sat) day +='토' ;

                document.getElementById('info-content-groupMeetsday').innerHTML = day;
                document.getElementById('info-content-groupMembers').innerHTML = res.data.groupMembers.length;
            })
            .catch((err)=>{
                console.log(err);
            });
    } else {
        document.getElementById('info-placeholder').style.display ='flex';
        document.getElementById('info-content').style.display = 'none';

        document.getElementById('calendar').style.display = 'none';
        document.getElementById('groupAdd').style.display = 'flex';
    }
}

function checkboxClicked(id){
    let chkbox = document.getElementById(id);
    chkbox.value = chkbox.checked;
}

function updategroupAddPane(){
    document.getElementById('calendar').style.display = 'none';
    document.getElementById('groupAdd').style.display = 'none';
    document.getElementById('groupUpdate').style.display = 'flex';

    const groupId = document.getElementById('info-content-groupId').innerHTML;

    axios.get('/account/retriveGroupInfo',{
        params: {
            id: groupId
        }
    })  
        .then((res)=>{
            document.getElementById('groupUpdatePane-title').innerHTML = `${res.data.groupName} 정보수정`;
            document.getElementById('groupNameInput').value = res.data.groupName;
            document.getElementById('groupIdInput').value = res.data.groupId;
            document.getElementById('groupInfoInput').value = res.data.groupInfo; 

            if(res.data.groupMeetings.sun) updateChkbox('sunInp');
            if(res.data.groupMeetings.mon) updateChkbox('monInp');
            if(res.data.groupMeetings.tue) updateChkbox('tueInp');
            if(res.data.groupMeetings.wed) updateChkbox('wedInp');
            if(res.data.groupMeetings.thu) updateChkbox('thuInp');
            if(res.data.groupMeetings.fri) updateChkbox('friInp');
            if(res.data.groupMeetings.sat) updateChkbox('satInp');
        })
        .catch((err)=>{
            console.log(err);
        });
}

function updateChkbox(id){
    document.getElementById(id).value=true;
    document.getElementById(id).checked=true;
}

function deleteBtnClicked(){
    console.log('delete!');
}