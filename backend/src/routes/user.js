const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users.js");
const bcrypt = require('bcrypt');

require('dotenv').config();
const router = express.Router();

router.post("/register", async (req, res) => {
    console.log(req.body.data);
    const user = await UserModel.findOne({ email: req.body.data.email });// $or: [{ email: mail }, { phone: phon }] });

    if (user) {
        console.log('Failed: Email already exists');
        return res.status(400).json({ message: "Email already exists" });
    }
    const user1 = await UserModel.findOne({ phone: req.body.data.phone });
    if (user1) {
        console.log('Failed: Phone number already exists');
        return res.status(400).json({ message: "Phone number already exists" });
    }

    const newUser = new UserModel({
        firstname: req.body.data.firstname,
        lastname: req.body.data.lastname,
        phone: req.body.data.phone,
        email: req.body.data.email,
        password: req.body.data.password,
        dateOfBirth: req.body.data.dateOfBirth,

        conferencesCreated: [],
        lecturesCreated: [],
        joinedConferences: [],
        joinedLectures: [],
    });
    await newUser.save();
    console.log('\nRegistered successfully as: ', newUser);
    res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
    console.log('Trying to login as: ', JSON.stringify(req.body.data));
    const user = await UserModel.findOne({ email: req.body.data.email });

    if (!user) {
        console.log("Email does not exists")
        return res.status(400).json({ message: "Email does not exists" });
    }
    const isPasswordValid = await bcrypt.compare(req.body.data.password, user.password);
    if (!isPasswordValid) {
        console.log("Password is incorrect")
        return res.status(400).json({ message: "Password is incorrect" });
    }
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });

    res.status(200).json({ token: accessToken, userID: user._id });
    console.log('\ntoken: ' + accessToken + ', \n' + 'sending it to client...');
    console.log('\nLogging as: ' + user);
});

module.exports = { userRouter: router };

