const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/sendBroadcastMessages", async (req, res) => {
    console.log('Trying to send the following messages: ', JSON.stringify(req.body.data));

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL, // generated ethereal user
            pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
    });

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

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_MAIL, // generated ethereal user
            pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
    });

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
module.exports = { messageRouter: router };

