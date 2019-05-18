const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    id: String,
    pw: String,
    salt: String,
    groupList: [{
        groupName: String,
        groupId: String
    }]
    
});

module.exports = mongoose.model('account', Account);