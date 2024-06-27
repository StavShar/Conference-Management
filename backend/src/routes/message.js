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
});


module.exports = { messageRouter: router };

