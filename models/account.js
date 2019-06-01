const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Group = new Schema({
    groupName: String,
    groupId: String,
    groupInfo: String,
    groupMeetings: {
        sun: Boolean,
        mon: Boolean,
        tue: Boolean,
        wed: Boolean,
        thu: Boolean,
        fri: Boolean,
        sat: Boolean
    },
    groupMembers: [String]
});

const Account = new Schema({
    name: String,
    id: String,
    pw: String,
    salt: String,
    groupList: [new Schema({
        groupName: String,
        groupId: String
    })]
});


const account  = mongoose.model('account', Account);
const group = mongoose.model('group',Group);

module.exports = {account,group};