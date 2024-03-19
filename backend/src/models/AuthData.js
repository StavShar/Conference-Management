const mongoose = require('mongoose');

const AuthDataSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const AuthDataModel = mongoose.model("authData", AuthDataSchema);

module.exports = AuthDataModel;