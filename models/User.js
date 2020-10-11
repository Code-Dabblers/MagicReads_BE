// User Model

const  mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // User Schema
})

module.exports = mongoose.model("User", UserSchema)