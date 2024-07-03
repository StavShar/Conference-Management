const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const LectureModel = require("../models/Lectures.js");
const UserModel = require("../models/Users.js");

const router = express.Router();

let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_MAIL, // generated ethereal user
        pass: process.env.SMTP_PASSWORD, // generated ethereal password
    },
});

router.post("/sendBroadcastMessages", async (req, res) => {
    console.log('Trying to send the following messages: ', JSON.stringify(req.body.data));

    const sendEmail = expressAsyncHandler(async (req, res) => {
        const { email, subject, message, lectureData } = req;

        console.log('sending a message with those details: ', email, '|', subject, '|', message, '|', lectureData);

        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            text: message + '\n' + lectureData,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent successfully!");
            }
        });
    });
    req.body.data.map(msg => sendEmail(msg));

    console.log('All broadcast messages sent successfully');
    return res.status(200).json({ data: 'All broadcast messages sent successfully' });
});

router.post("/sendUpdateMessages", async (req, res) => {
    console.log('Trying to send this message:\n', req.body.data.message);
    console.log('to the following emails: ', req.body.data.emails);
    const message = req.body.data.message;

    const sendEmail = expressAsyncHandler(async (req, res) => {

        var mailOptions = {
            from: process.env.SMTP_MAIL,
            to: req,
            subject: 'Updated lecture details',
            text: message,
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log('Email failed: ', error);
                return res.status(403).json({ data: 'An error has occurred when trying to send an email about the updated details of a lecture..\n', error });
            } else {
                console.log("Email sent successfully!");
            }
        });
    });
    req.body.data.emails.map(email => sendEmail(email));

    console.log('All update messages sent successfully');
    return res.status(200).json({ data: 'All update messages sent successfully' });
});

// Schedule the reminder messages
cron.schedule('0 20 * * *', async () => { // every day at 20:00 (Israel timezone)
    console.log('Trying to get all the lectures scheduled for tomorrow..')

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(today.getDate() + 1);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setUTCHours(23, 59, 59, 999);

    // find all the lectures scheduled for tomorrow
    const tomorrowLectures = await LectureModel.find({
        date: {
            $gte: tomorrowStart,
            $lt: tomorrowEnd
        }
    });
    if (!tomorrowLectures) {
        console.log('ERROR! Tomorrow lectures not found');
        return; // Stop the task because there is an error 
    }
    if (tomorrowLectures.length === 0) {
        console.log('There are no lectures scheduled for tomorrow.');
        return; // Stop this task because there is no scheduled lectures for tomorrow
    }

    console.log('Tomorrow lectures: ', tomorrowLectures);

    const reminderLectureByID = async (lecture) => {
        console.log('Getting the relevant participants list from DB...');
        const participants = await UserModel.find({ joinedLectures: { $in: [lecture._id] } });

        if (!participants) {
            console.log('ERROR! participants not found');
            return;
        }
        console.log('Lecture ID: ', lecture._id);
        console.log('All joined participants of this lecture: ', participants);

        function extractDate(datetime) {
            if (!datetime) return 'N/A';
            return new Date(datetime).toISOString().split('T')[0];
        }

        function extractTime(datetime) {
            if (!datetime) return 'N/A';
            const time = new Date(datetime).toISOString().split('T')[1].split(':');
            return `${time[0]}:${time[1]}`;
        }

        //sending reminder messages
        const sendEmail = expressAsyncHandler(async (req, res) => {
            const email = req;
            const subject = `Reminder message about ${lecture.title}`;
            const message = 'This is an auto-reminder message for your lecture scheduled for tomorrow.';
            const lectureData = `\nLecture details:\n  title: ${lecture.title},\n  date: ${extractDate(lecture.date)},\n  starting time: ${extractTime(lecture.date)},\n  location: ${lecture.location}`; // this is the data of the lecture

            console.log('sending a reminder message with those details: ', email, '|', subject, '|', message, '|', lectureData);

            var mailOptions = {
                from: process.env.SMTP_MAIL,
                to: email,
                subject: subject,
                text: message + '\n' + lectureData,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent successfully!");
                }
            });
        });
        console.log('Sending reminder messages to all participants...');
        participants.map(participant => sendEmail(participant.email));
    }

    reminderLectureByID(tomorrowLectures[0]);
}, {
    timezone: "Asia/Jerusalem" // Adjust the timezone according to Israel (UTC+2/UTC+3)
});

module.exports = { messageRouter: router };

