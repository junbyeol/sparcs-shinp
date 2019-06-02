/* eslint-disable no-undef */
/* eslint-disable no-console */
/* public/scripts/main.js */

console.log('start');
let loginedID;
let showingGroup;

// eslint-disable-next-line no-undef

async function loadPage(){

    document.getElementById('calendar').style.display = 'none';
    document.getElementById('groupAdd').style.display = 'none';
    document.getElementById('groupUpdate').style.display = 'none';

    //loadLoginedID();
    await axios.post('/getSession')
        .then((res)=>{
            document.getElementById('login-status-loginedID').innerHTML
         = res.data.id;

            loginedID = res.data.id;
        })
        .catch((err)=>{
            console.log(err);
        });

    //loadGrouplist();
    await axios.get('/account/retriveAccount',{
        params:{
            id: loginedID
        }
    })
        .then((res)=> {
            const groups = res.data.groupList;
            for(let i=0;i<groups.length;i++){
                addGrouplist(groups[i]);
            }
            addGrouplist({groupName:"+ 새 그룹 추가", groupId:"add"});

            addToMember(res.data.id,false,'Add');
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

function deleteGrouplist(val){
    document.getElementById(`grouplist-${val}`).parentNode.remove();
}

function groupListClicked(groupId){
    if(groupId!=="add") {

        //왼쪽 위 정보판넬 수정
        document.getElementById('info-placeholder').style.display ='none';
        document.getElementById('info-content').style.display = 'flex';

        axios.get('/account/retriveGroup',{
            params: {
                id: groupId
            }
        })
            .then((res)=>{
                showingGroup = res.data;
                showCalendar();

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
        document.getElementById('groupUpdate').style.display = 'none';
    }
}

function checkboxClicked(id){
    let chkbox = document.getElementById(id);
    chkbox.value = chkbox.checked;
}

function loadgroupUpdatePane(){
    document.getElementById('calendar').style.display = 'none';
    document.getElementById('groupAdd').style.display = 'none';
    document.getElementById('groupUpdate').style.display = 'flex';

    const groupId = document.getElementById('info-content-groupId').innerHTML;

    axios.get('/account/retriveGroup',{
        params: {
            id: groupId
        }
    })  
        .then((res)=>{
            document.getElementById('groupUpdatePane-title').innerHTML = `${res.data.groupName} 정보수정`;
            document.getElementById('groupNameInput').value = res.data.groupName;
            document.getElementById('groupIdInput').value = res.data.groupId;
            document.getElementById('groupInfoInput').value = res.data.groupInfo; 

            //reset memberList
            var momElem = document.getElementById('groupUpdate-memberList');
            var childElem = momElem.lastElementChild;
            while(childElem){
                momElem.removeChild(childElem);
                childElem = momElem.lastElementChild;
            }

            //put member's name in memberList
            res.data.groupMembers.forEach((mem)=>{
                if(mem===loginedID) addToMember(mem,false,'Update');
                else addToMember(mem,false,'Update');
            });
            
            //check the checkboxes
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

function outBtnClicked(){
    axios.post('/account/groupOut',{
        user: loginedID,
        group: showingGroup.groupId
    })
        .then((res)=>{
            document.getElementById('info-placeholder').style.display ='flex';
            document.getElementById('info-content').style.display = 'none';

            document.getElementById('calendar').style.display = 'none';
            document.getElementById('groupAdd').style.display = 'none';
            document.getElementById('groupUpdate').style.display = 'none';

            deleteGrouplist(showingGroup.groupId);
        })
        .catch((err)=>{
            console.log(err);
        });
}

function showCalendar(){
    document.getElementById('calendar').style.display = 'flex';
    document.getElementById('groupAdd').style.display = 'none';
    document.getElementById('groupUpdate').style.display = 'none';

    console.log(showingGroup);
    buildCalendar(showingGroup.groupMeetings);
}

function searchMember(id,type){
    let text = document.getElementById(id).value;
    document.getElementById(id).value = '';

    axios.get('/account/retriveAccount',{
        params:{
            id: text
        }
    })
        .then((res)=> {
            if(res.data){
                let member = document.createElement('li');
                member.style.listStyle="none";
                member.innerHTML = `
                <div id="tmpSearch" style="font-size:14px">
                    ${res.data.name}
                    <button type="button" onclick="
                    addToMember('${res.data.id}',true,'${type}');
                    document.getElementById('tmpSearch').remove();
                    ">=></button>
                </div>`;
                document.getElementById(`group${type}-searchPane`).appendChild(member);
                text='';
            }
            else {
                let member = document.createElement('li');
                member.style.listStyle="none";
                member.innerHTML = `
                <div id="tmpSearch" style="font-size:14px">
                    해당 id의 유저가 없습니다.
                </div>`;
                document.getElementById(`group${type}-searchPane`).appendChild(member);
                text='';
            }
        })
        .catch((err)=>{
            console.log(err);
        });
}

function addToMember(id,flag,type){
    axios.get('/account/retriveAccount',{
        params:{
            id: id
        }
    })
        .then((res)=>{
            let newElem = document.createElement('li');
            newElem.style.listStyle="none";
            newElem.className = "memberListelem";
            newElem.id = `group${type}-elem-${res.data.id}`;
            
            if(!flag) {newElem.innerHTML = `
            <label>${res.data.name}</label>
            <button type="button" onclick="deleteElem('${res.data.id}','${type}')" disabled>x</button>
            `; 
            } else {
                newElem.innerHTML = `
            <label>${res.data.name}</label>
            <button type="button" onclick="deleteElem('${res.data.id}','${type}')">x</button>
            `;
            }

            document.getElementById(`group${type}-memberList`).appendChild(newElem);

            document.getElementById(`group${type}-groupMembers`).value+=res.data.id+'.';
        })
        .catch((err)=>{
            console.log(err);
        });
}

function deleteElem(id,type){
    const realId = `group${type}-elem-${id}`;
    document.getElementById(realId).remove();

    let groupMembers = document.getElementById(`group${type}-groupMembers`).value;

    groupMembers = groupMembers.split('.');
    groupMembers.pop();

    const idx = groupMembers.indexOf(id);
    if(idx>-1) groupMembers.splice(idx,1);

    let string ='';

    groupMembers.forEach((str)=>{
        string += str +'.';
    });

    document.getElementById(`group${type}-groupMembers`).value = string;
}