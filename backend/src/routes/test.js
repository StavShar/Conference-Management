// backend/src/routes/api.js

const express = require("express");
const ConferenceModel = require("../models/Conferences.js");
const UserModel = require("../models/Users.js")
const LectureModel = require("../models/Lectures.js");
require('dotenv').config();
const router = express.Router();
// Endpoint to delete specific objects
router.post('/delete', async (req, res) => {
  try {
    console.log('Deleting objects...');
    // Delete Lectures with title "TestLecture"
    await LectureModel.deleteMany({ title: 'TestLecture' });
    await LectureModel.deleteMany({ title: 'NewTestLecture' });

    // Delete Conferences with name "TestConference"
    await ConferenceModel.deleteMany({ title: 'TestConference' });

    


    try {
        await UserModel.updateOne(
            { email: 'test1@test.test' },
            { 
                $set: {
                    conferencesCreated: [],
                    lecturesCreated: [],
                    joinedConferences: [],
                    joinedLectures: []
                }
            }

        );
        console.log(`User data has been reset for user`);
    } catch (error) {
        console.error('Error resetting user data:', error);
    }
    try {
        await UserModel.updateOne(
            { email: 'test2@test.test' },
            { 
                $set: {
                    conferencesCreated: [],
                    lecturesCreated: [],
                    joinedConferences: [],
                    joinedLectures: []
                }
            }

        );
        console.log(`User data has been reset for user`);
    } catch (error) {
        console.error('Error resetting user data:', error);
    }
    
    res.status(200).send('Objects deleted successfully');
  } catch (error) {
    console.error('Error deleting objects:', error);
    res.status(500).send('Error deleting objects');
  }
});


router.get('/test', async (req, res) => {
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

router.post('/test2', async (req, res) => {
    console.log('Getting all conferences from DB...');
});

module.exports = {testRouter : router};

