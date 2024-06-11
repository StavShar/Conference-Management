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

router.get("/getCreatedLectures", verifyToken, async (req, res) => {
    console.log('Getting all created lecture from DB...');
    const user = await UserModel.findOne({ _id: req.headers.userid });

    if (!user) {
        console.log('ERROR! user not found');
        return res.status(404).send({ error: 'User not found' });
    }
    console.log('User ID: ', user._id);
    console.log('All lecture that created by this user: ', user.lecturesCreated);

    console.log('sending all created lecture to client...');
    return res.status(200).json({ data: user.lecturesCreated });
});

router.get("/getJoinedLecture", verifyToken, async (req, res) => {
    console.log('Getting all joined lecture from DB...');
    const user = await UserModel.findOne({ _id: req.headers.userid });

    if (!user) {
        console.log('ERROR! user not found');
        return res.status(404).send({ error: 'User not found' });
    }
    console.log('User ID: ', user._id);
    console.log('All joined lecture of this user: ', user.joinedLectures);

    console.log('sending all created Lecture to client...');
    return res.status(200).json({ data: user.joinedLectures });
});

router.post("/joinLecture", verifyToken, async (req, res) => {
    const userID = req.headers.userid;
    const lectureID = req.body.data.lectureID;
    console.log('Getting a "join a lecture" request...');
    console.log("user: ", userID);
    console.log('lecture: ', lectureID);

    const user = await UserModel.findOne({ _id: userID });
    if (!user) {
        console.log('ERROR! user not found');
        return res.status(404).json({ data: 'User not found' });
    }

    const lecture = await LectureModel.findOne({ _id: lectureID });
    if (!lecture) {
        console.log('ERROR! lecture not found');
        return res.status(404).json({ data: 'lecture not found' });
    }

    if (lecture.lectureCreator.equals(user._id)) {
        console.log("ERROR! This lecture created by you");
        return res.status(404).json({ data: 'This lecture created by you' });
    }

    if (user.joinedLectures.includes(lectureID) || lecture.participants.includes(userID)) {
        console.log("ERROR! This user already joined to this lecture")
        return res.status(404).json({ data: 'This user already joined to this lecture' });
    }

    await UserModel.updateOne({ _id: userID }, { $push: { joinedLectures: lectureID } });
    await LectureModel.updateOne({ _id: lectureID }, { $push: { participants: userID } });

    console.log('sending all joined lecture to client...');
    return res.status(200).json({ data: user.joinedLectures });
});

router.post("/editLecture", verifyToken, async (req, res) => {
    console.log('Getting a "edit a lecture" request...' + req.body.data._id);
    const lectureID = req.body.data._id;
    const lecture = await LectureModel.findOne({ _id: lectureID });

    if (!lecture) {
        console.log('Failed: lecture not found');
        return res.status(400).json({ message: "lecture not found" });
    }

    console.log('Editing lecture with the following details: ', req.body.data);
    await LectureModel.updateOne(
        { _id: lectureID },
        {
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
        });

    console.log('lecture has been updated');
    return res.status(200).json({ message: "lecture has been updated" });
});

router.post("/cancelLecture", verifyToken, async (req, res) => {
    const lectureID = req.body.data.lectureID;
    const userID = req.body.data.userid;
    console.log('Getting a "cencell a lecture" request...');
    console.log('lecture: ', lectureID + ' user: ' + userID);

    const lecture = await LectureModel.findOne({ _id: lectureID });
    if (!lecture) {
        console.log('ERROR! lecture not found');
        return res.status(404).json({ data: 'lecture not found' });
    }

    await LectureModel.updateOne(
        { _id: lectureID },
    {$pull: {participants: userID}});

    await UserModel.updateOne({ _id: userID },
         { $pull: { joinedLectures: lectureID } });
   


    return res.status(200).json({ data: 'lecture has been canceled' });


});



module.exports = { lectureRouter: router };

