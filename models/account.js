const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    profile: {
        username: String,
        thumbnail: { type: String, default: '/public/images/default_thumbnail.png' }
    },
    password: String, // 로컬계정의 경우엔 비밀번호를 해싱해서 저장합니다
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('account', Account);