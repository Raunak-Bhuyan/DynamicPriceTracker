const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    fullname: String,
    username: String,
    email: String,
    password: String,
    productList: [String],
});

module.exports = mongoose.model("user", userSchema);