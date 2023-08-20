const mongoose = require('mongoose');

const logoutSchema = new mongoose.Schema({
    token : {type : String, required : true}
})

const LogoutModel = mongoose.model('logout', logoutSchema);

module.exports = LogoutModel;