const express = require("express");
const jwt = require("jsonwebtoken");
const ConferenceModel = require("../models/Conference.js");
const UserModel = require("../models/Users.js")
const { verifyToken } = require('../middlewares/authMiddleware.js');

require('dotenv').config();
const router = express.Router();

router.post("/createConference", verifyToken, async (req, res) => {
    console.log("creating post with the following details: ", req.body.data);
    const conference = await ConferenceModel.findOne({ location: req.body.data.location, date: req.body.data.date });

    if (conference) {
        console.log('Failed: The location is already taken at the time you wanted');
        return res.status(400).json({ message: "The location is already taken at the time you wanted" });
    }

    const newConference = new ConferenceModel({
        title: req.body.data.title,
        maxParticipants: req.body.data.maxParticipants,
        location: req.body.data.location,
        description: req.body.data.description,
        durationTime: req.body.data.durationTime,
        date: req.body.data.date,
        form: req.body.data.form,
        conferencesCreator: req.headers.userid
    });

    await newConference.save();


    console.log('\n A new conference was successfully created with the details: ', newConference);
    res.json({ message: "Conference was successfully created" });

    await UserModel.updateOne({ _id: newConference.conferencesCreator }, { $push: { conferencesCreated: newConference._id } });
    const userCreator = await UserModel.findOne({ _id: newConference.conferencesCreator });
    if (!userCreator) {
        console.log('Failed: The creator not found in the users table');
        return res.status(400).json({ message: "The creator not found in the users table" });
    }

    console.log('temp: ', userCreator);
});


router.get("/getAllConferences", async (req, res) => {
    console.log('Getting all conferences from DB...');
    const conferences = await ConferenceModel.find();

    if (!conferences) {
        console.log('ERROR! no conferences found');
        return res.status(404).send({ error: 'No conferences found' });
    }

    console.log('All conferences: ', conferences);

    console.log('sending all posts to client...');
    return res.status(200).json({ data: conferences });
});

module.exports = { conferenceRouter: router };

