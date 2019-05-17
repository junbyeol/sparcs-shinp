const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    id: String,
    //thumbnail: { type: String, default: '/public/images/default_thumbnail.png' },
    pw: String,
    //createdAt: { type: Date, default: Date.now }
    salt: String
});

module.exports = mongoose.model('account', Account);