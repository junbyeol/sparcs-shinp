const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Group = new Schema({
    groupName: String,
    groupId: String,
    groupInfo: String,
    groupMeetings: {
        sunday: Boolean,
        monday: Boolean,
        tuesday: Boolean,
        wednesday: Boolean,
        thursday: Boolean,
        friday: Boolean,
        saturday: Boolean
    }
});

const Account = new Schema({
    id: String,
    pw: String,
    salt: String,
    groupList: [Group] 
});

module.exports = mongoose.model('account', Account);