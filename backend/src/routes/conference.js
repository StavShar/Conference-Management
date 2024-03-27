const express = require("express");
const jwt = require("jsonwebtoken");
const ConferenceModel = require("../models/Conference.js");

require('dotenv').config();
const router = express.Router();

router.post("/createConference", async (req, res) => {
    console.log(req.body.data);
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
    });

    await newConference.save();
    console.log('\n A new conference was successfully created with the details: ', newConference);
    res.json({ message: "Conference was successfully created" });
});

module.exports = { conferenceRouter: router };

