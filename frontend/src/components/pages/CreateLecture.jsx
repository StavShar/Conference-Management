import React, { useState } from 'react';
import { createLecture } from '../../services/lecService';
import { useNavigate, useLocation } from 'react-router-dom';
import QaFormat from '../QaFormat';
import './styles/CreateLecture.css'

function CreateLecture() {
    const [inputDateType, setInputDateType] = useState('text');
    const [inputDurationTimeType, setInputDurationTimeType] = useState('text');
    const [personalForm, setPersonalForm] = useState(false);
    const [qaFormData, setQaFormData] = useState([]);
    const conference = useLocation().state.conference;

    const navigate = useNavigate();

    const receiveQaFormData = (data) => {
        setQaFormData(data);
    };

    const printErrorMsg = (msg) => {
        document.getElementById('message').textContent = msg;
    }

    async function createLec() {

        const title = document.getElementById('title').value;
        const maxParticipants = document.getElementById('max-participants').value;
        const location = document.getElementById('location').value;
        const description = document.getElementById('description').value;
        const durationTime = document.getElementById('time').value;
        const date = new Date(document.getElementById('date').value);
        const form = qaFormData
        const lecturerName = document.getElementById('lecturer-name').value;
        const lecturerInfo = document.getElementById('lecturer-info').value;
        const lecturerPic = document.getElementById('lecturer-picture').value;

        const maxParticipantsValidation = (maxParticipants) => {
            if (maxParticipants >= 10 && maxParticipants <= 200)
                return true;
            return false;
        }

        const locationValidation = (location) => {
            // we dont know how to implement it yet
            return true;
        }

        const durationTimeValidation = (durationTime) => {
            if (durationTime >= "00:30" && durationTime <= "5:00")
                return true;
            return false;
        }

        const dateValidation = (date) => {
            const now = new Date();
            const diff = (date - now) / 36e5;
            // console.log('now: ', now, '\ndate: ', date, '\n diff: ', diff)

            if (diff >= 24)
                return true;
            return false;
        }

        const dateConfereceValidation = (date) => {

            const conferenceStartDate = new Date(conference.startDate);
            const conferenceEndDate = new Date(conference.endDate);
            if (date >= conferenceStartDate && date <= conferenceEndDate)
                return true;
            return false;
        }




        // checking if there are empty fields
        if (!(title && maxParticipants && location && description && durationTime && date && lecturerName && lecturerInfo))
            printErrorMsg("Error! fields can't be empty");

        //checking validation of max participants
        else if (!maxParticipantsValidation(maxParticipants))
            printErrorMsg("Error! max participants must be between 10 to 200")

        //checking validation of location
        else if (!locationValidation(location))
            printErrorMsg("Error! location is invalid")

        //checking validation of duration time
        else if (!durationTimeValidation(durationTime))
            printErrorMsg("Error! duration time must be between 00:30 to 5:00")

        //checking validation of the date
        else if (!dateValidation(date))
            printErrorMsg("Error! the lecture should start at least 24 hours from now")

        else if (!form)
            printErrorMsg("Error! you must  for the lecture")

        else if (!dateConfereceValidation(date))
            printErrorMsg("Error! the lecture should be in the conference date")


        else {
            printErrorMsg('');

            /* Packs data to 'JSON' format to send via web */
            const data = {
                title: title,
                maxParticipants: maxParticipants,
                location: location,
                description: description,
                durationTime: durationTime,
                date: date,
                form: form,
                lecturerName: lecturerName,
                lecturerInfo: lecturerInfo,
                lecturerPic: lecturerPic,
                conferenceID: conference._id,
                // lectureCreator: conference.conferenceCreator // get creator id from userID in header
                // participants: []
            }

            console.log(data);

            const res = await createLecture(data);
            if (res && res.status === 200)
                navigate('/myConferences');
            else
                printErrorMsg(res);
            console.log(res);
        }


    }

    const handleForm = () => {
        setPersonalForm(true);
    };



    return (

        <div>
            <h2>Create Lecture Form</h2>
            <link href="https://font.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet"></link>
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
            <form>
                <div className='create-div'>
                    <input className='create-field' type="text" id="title" placeholder="Title" required />
                </div>

                <div className='create-div'>
                    <input className='create-field' type="text" id="max-participants" placeholder="Max participants" required />
                </div>

                <div className='create-div'>
                    <input className='create-field' type="text" id="location" placeholder="Location" required />
                </div>

                <div className='create-div'>
                    <input className='create-field' id="date" type={inputDateType} placeholder="Date and starting time" onFocus={() => { setInputDateType('datetime-local') }} onBlur={() => { document.getElementById('date').value ? setInputDateType('datetime-local') : setInputDateType('text') }} required />
                </div>

                <div className='create-div'>
                    <input className='create-field' type={inputDurationTimeType} placeholder='Duration time' id="time" min="00:00" max="5:00" onFocus={() => { setInputDurationTimeType('time') }} onBlur={() => { document.getElementById('time').value ? setInputDurationTimeType('time') : setInputDurationTimeType('text') }} required />
                </div>

                <div className='create-div'>
                    <input className='create-field' type="text" id="description" placeholder="Description" required />
                </div>
                <div className='create-div'>
                    <input className='create-field' type="text" id="lecturer-name" placeholder="Lecturer's name" required />
                </div>
                <div className='create-div'>
                    <input className='create-field' type="text" id="lecturer-info" placeholder="Lecturer's info" required />
                </div>
                <div className='create-div'>
                    <input className='create-field' type="text" id="lecturer-picture" placeholder="Lecturer's picture URL" />
                </div>
                <div>
                    {!personalForm && (
                        <button type="button" onClick={handleForm}>Do you want make personal Form</button>
                    )}
                    {personalForm && (
                        <QaFormat data={receiveQaFormData} />
                    )}
                </div>
                <p id="message"></p>

                <input type="button" onClick={createLec} value='Create'></input>
            </form>
        </div>

    );
}

export default CreateLecture;
