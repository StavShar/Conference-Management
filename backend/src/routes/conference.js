const express = require("express");
const jwt = require("jsonwebtoken");
const ConferenceModel = require("../models/Conferences.js");
const UserModel = require("../models/Users.js")
const LectureModel = require("../models/Lectures.js");
const { verifyToken } = require('../middlewares/authMiddleware.js');

require('dotenv').config();
const router = express.Router();


router.post("/createConference", verifyToken, async (req, res) => {
    console.log("creating conference with the following details: ", req.body.data);

    const newConference = new ConferenceModel({
        title: req.body.data.title,
        location: req.body.data.location,
        description: req.body.data.description,
        startDate: req.body.data.startDate,
        endDate: req.body.data.endDate,
        picURL: req.body.data.picURL,
        conferenceCreator: req.headers.userid
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
    const createdConferences = await ConferenceModel.find({ conferenceCreator: req.headers.userid });

    if (!createdConferences) {
        console.log('ERROR! created conferences not found');
        return res.status(404).send({ error: 'Created conferences not found' });
    }
    console.log('User ID: ', req.headers.userid);
    console.log('All conferences that created by this user: ', createdConferences);

    console.log('sending all created conferences to client...');
    return res.status(200).json({ data: createdConferences });
});

router.get("/getLectures", async (req, res) => {
    console.log('Fetching lectures for conference ID:', req.query);
    const { conferenceID } = req.query;
    console.log('conferenceID:', conferenceID);

    const lectures = await LectureModel.find({ conferenceID: conferenceID });

    if (!lectures || lectures.length === 0) {
        console.log('ERROR! No lectures found');
        return res.status(404).send({ error: 'No lectures found' });
    }

    console.log('Lectures:', lectures);
    res.json(lectures);
});

module.exports = { conferenceRouter: router };

