const express = require("express");
const jwt = require("jsonwebtoken");
const LectureModel = require("../models/Lectures.js");
const UserModel = require("../models/Users.js")
const { verifyToken } = require('../middlewares/authMiddleware.js');
const ConferenceModel = require("../models/Conferences.js");

require('dotenv').config();
const router = express.Router();

router.post("/createLecture", verifyToken, async (req, res) => {
    console.log("creating lecture with the following details: ", req.body.data);
    const lecture = await LectureModel.findOne({ location: req.body.data.location, date: req.body.data.date });

    if (lecture) {
        console.log('Failed: The location is already taken at the time you wanted');
        return res.status(400).json({ message: "The location is already taken at the time you wanted" });
    }

    const newLecture = new LectureModel({
        title: req.body.data.title,
        maxParticipants: req.body.data.maxParticipants,
        location: req.body.data.location,
        description: req.body.data.description,
        durationTime: req.body.data.durationTime,
        date: req.body.data.date,
        form: req.body.data.form,
        lecturerName: req.body.data.lecturerName,
        lecturerInfo: req.body.data.lecturerInfo,
        lecturerPic: req.body.data.lecturerPic,
        lectureCreator: req.headers.userid,
        conferenceID: req.body.data.conferenceID,
        participants: [],
    });
    console.log('newLecture data: ', newLecture)
    await newLecture.save();


    console.log('\n A new lecture was successfully created with the details: ', newLecture);
    res.json({ message: "lecture was successfully created" });

    await UserModel.updateOne({ _id: newLecture.lectureCreator }, { $push: { lecturesCreated: newLecture._id } });
    const userCreator = await UserModel.findOne({ _id: newLecture.lectureCreator });
    if (!userCreator) {
        console.log('Failed: The creator not found in the users table');
        return res.status(400).json({ message: "The creator not found in the users table" });
    }

    await ConferenceModel.updateOne({ _id: newLecture.conferenceID }, { $push: { lectures: newLecture._id } });
    const linkedConference = await ConferenceModel.findOne({ _id: newLecture.conferenceID });
    if (!linkedConference) {
        console.log('Failed: The linked conference not found in the conferences table');
        return res.status(400).json({ message: "The linked conference not found in the conferences table" });
    }
});

module.exports = { lectureRouter: router };

