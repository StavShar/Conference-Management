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
        conferenceCreator: req.headers.userid,
    });

    await newConference.save();


    console.log('\n A new conference was successfully created with the details: ', newConference);
    res.json({ message: "Conference was successfully created" });

    await UserModel.updateOne({ _id: newConference.conferenceCreator }, { $push: { conferencesCreated: newConference._id } });
    const userCreator = await UserModel.findOne({ _id: newConference.conferenceCreator });
    if (!userCreator) {
        console.log('Failed: The creator not found in the users table');
        return res.status(400).json({ message: "The creator not found in the users table" });
    }
});


router.get("/getAllConferences", async (req, res) => {
    console.log('Getting all conferences from DB...');
    const conferences = await ConferenceModel.find();

    if (!conferences) {
        console.log('ERROR! no conferences found');
        return res.status(404).send({ error: 'No conferences found' });
    }

    console.log('All conferences: ', conferences);

    console.log('sending all conferences to client...');
    return res.status(200).json({ data: conferences });
});

router.get("/getCreatedConferences", verifyToken, async (req, res) => {
    console.log('Getting all created conferences from DB...');
    const user = await UserModel.findOne({ _id: req.headers.userid });

    if (!user) {
        console.log('ERROR! user not found');
        return res.status(404).send({ error: 'User not found' });
    }
    console.log('User ID: ', user._id);
    console.log('All conferences that created by this user: ', user.conferencesCreated);

    console.log('sending all created conferences to client...');
    return res.status(200).json({ data: user.conferencesCreated });
});

router.get("/getJoinedConferences", verifyToken, async (req, res) => {
    console.log('Getting all joined conferences from DB...');
    const user = await UserModel.findOne({ _id: req.headers.userid });

    if (!user) {
        console.log('ERROR! user not found');
        return res.status(404).send({ error: 'User not found' });
    }
    console.log('User ID: ', user._id);
    console.log('All joined conferences of this user: ', user.joinedConferences);

    console.log('sending all created conferences to client...');
    return res.status(200).json({ data: user.joinedConferences });
});

router.post("/joinConference", verifyToken, async (req, res) => {
    const userID = req.headers.userid;
    const conferenceID = req.body.data.conferenceID;
    console.log('Getting a "join a conference" request...');
    console.log("user: ", userID);
    console.log('conference: ', conferenceID);

    const user = await UserModel.findOne({ _id: userID });
    if (!user) {
        console.log('ERROR! user not found');
        return res.status(404).json({ data: 'User not found' });
    }

    const conference = await ConferenceModel.findOne({ _id: conferenceID });
    if (!conference) {
        console.log('ERROR! conference not found');
        return res.status(404).json({ data: 'Conference not found' });
    }

    if (conference.conferenceCreator.equals(user._id)) {
        console.log("ERROR! This conference created by you");
        return res.status(404).json({ data: 'This conference created by you' });
    }

    if (user.joinedConferences.includes(conferenceID) || conference.participants.includes(userID)) {
        console.log("ERROR! This user already joined to this conference")
        return res.status(404).json({ data: 'This user already joined to this conference' });
    }

    await UserModel.updateOne({ _id: userID }, { $push: { joinedConferences: conferenceID } });
    await ConferenceModel.updateOne({ _id: conferenceID }, { $push: { participants: userID } });

    console.log('sending all joined conferences to client...');
    return res.status(200).json({ data: user.joinedConferences });
});

module.exports = { conferenceRouter: router };

