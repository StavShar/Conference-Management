const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: Number, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    conferencesCreated: [{ type: mongoose.Schema.Types.ObjectId, ref: "conferences" }],
    //joinedConferences: [{ type: mongoose.Schema.Types.ObjectId, ref: "conferences" }],
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;