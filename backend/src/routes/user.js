const express = require("express");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/Users.js");

require('dotenv').config();
const router = express.Router();

router.post("/register", async (req, res) => {
    console.log(req.body.data);
    const user = await UserModel.findOne({ email: req.body.data.email });// $or: [{ email: mail }, { phone: phon }] });

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
    res.json({ message: "User registered successfully" });
});

module.exports = { userRouter: router };

