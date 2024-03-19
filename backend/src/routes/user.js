const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users.js");
const AuthDataModel = require("../models/AuthData.js");
const bcrypt = require('bcrypt');

require('dotenv').config();
const router = express.Router();

router.post("/register", async (req, res) => {
    console.log(req.body.data);
    const user = await UserModel.findOne({ email: req.body.data.email });

    if (user) {
        return res.status(400).json({ message: "Email already exists" });
    }
    const user1 = await UserModel.findOne({ phone: req.body.data.phone });
    if (user1) {
        return res.status(400).json({ message: "Phone number already exists" });
    }

    const newUser = new UserModel({
        firstname: req.body.data.firstname,
        lastname: req.body.data.lastname,
        phone: req.body.data.phone,
        email: req.body.data.email,
        password: req.body.data.password,
        dateOfBirth: req.body.data.dateOfBirth,
        isCreator: req.body.data.isCreator/*,
        conferencesCreated: req.body.data.conferencesCreated,
        joinedConferences: req.body.data.joinedConferences */
    });
    await newUser.save();

    const newAuthData = new AuthDataModel({
        email: req.body.data.email,
        password: req.body.data.password
    });
    await newAuthData.save();

    res.json({ message: "User registered successfully" });
});

router.post("/loginAuth", async (req, res) => {
    const user = await AuthDataModel.findOne({ email: req.body.data.email });

    if (!user) {
        return res.status(400).json({ message: "Email does not exists" });
    }
    const isPasswordValid = await bcrypt.compare(req.body.data.password, user.password);
    if (!isPasswordValid) {
        console.log("password is incorrect")
        return res.status(400).json({ message: "Password is incorrect" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });

    res.status(200).json({ token: accessToken, userID: user._id });
    console.log('token: ' + accessToken + ', sending it to client...');
    console.log('Logging as: ' + user);
});

module.exports = { userRouter: router };

