import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { editLecture } from '../../services/lecService';
import { getParticipants } from '../../services/lecService';
import { sendUpdateMessages } from '../../services/msgService';

function EditPage() {
  const [participants, setParticipants] = useState([]); // list of the participants that joined the lecture
  const [inputDurationTimeType, setInputDurationTimeType] = useState('text');

  const { lecture } = useLocation().state || {};
  const navigate = useNavigate();

  const printErrorMsg = (msg) => {
    document.getElementById('message').textContent = msg;
  };

  function extractDate(datetime) {
    if (!datetime) return 'N/A';
    return new Date(datetime).toISOString().split('T')[0];
  }

  function extractTime(datetime) {
    if (!datetime) return 'N/A';
    const date = new Date(datetime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await getParticipants(lecture._id);
        setParticipants(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchParticipants();

  }, []);

  const editLec = async () => {
    const _id = lecture._id;
    const title = document.getElementById('title').value;
    const maxParticipants = document.getElementById('max-participants').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const durationTime = document.getElementById('time').value;
    const date = new Date(document.getElementById('date').value);
    const lecturerName = document.getElementById('lecturer-name').value;
    const lecturerInfo = document.getElementById('lecturer-info').value;
    const lecturerPic = document.getElementById('lecturer-picture').value;
    const MAX_PARTICIPANTS = 10;

    const maxParticipantsValidation = (maxParticipants) => {
      if ((maxParticipants >= MAX_PARTICIPANTS && maxParticipants <= 200) && (maxParticipants >= lecture.participants.length)) return true;
      return false;
    };

    const locationValidation = (location) => {
      // You can implement the validation logic here
      return true;
    };

    const durationTimeValidation = (durationTime) => {
      if (durationTime >= "00:30" && durationTime <= "5:00") return true;
      return false;
    };

    const dateValidation = (date) => {
      const now = new Date();
      const diff = (date - now) / 36e5;

      if (diff >= 24) return true;
      return false;
    };

    // Validate inputs
    if (!title || !maxParticipants || !location || !description || !durationTime || !date || !lecturerName || !lecturerInfo) {
      printErrorMsg("Error! Fields can't be empty");
      return;
    } else if (!maxParticipantsValidation(maxParticipants)) {
      let x = Math.max(MAX_PARTICIPANTS, lecture.participants.length);
      printErrorMsg(`Error! Max participants must be between ${x} to 200`);
      return;
    } else if (!locationValidation(location)) {
      printErrorMsg("Error! Location is invalid");
      return;
    } else if (!durationTimeValidation(durationTime)) {
      printErrorMsg("Error! Duration time must be between 00:30 to 5:00");
      return;
    } else if (!dateValidation(date)) {
      printErrorMsg("Error! The lecture should start at least 24 hours from now");
      return;
    }

    // Pack data to send via web
    const data = {
      _id: _id,
      title: title,
      participants: participants.map(participant => participant._id),
      maxParticipants: maxParticipants,
      location: location,
      description: description,
      durationTime: durationTime,
      date: date,
      lecturerName: lecturerName,
      lecturerInfo: lecturerInfo,
      lecturerPic: lecturerPic,
    };

    try {
      const res = await editLecture(data);
      if (res && res.status === 200) {
        console.log('lecture title: ' + document.getElementById('title').value);
        navigate(`/LecturePage/${document.getElementById('title').value}`, { state: { lecture: data } });
      } else {
        printErrorMsg(res);
      }
    } catch (error) {
      console.error('An error occurred while editing the lecture: ', error);
      printErrorMsg(error);
    }

    // send messages with the updated details to the participants of the lecture
    try {

      const lectureUpdatedData = `  Title: ${title},
        Date: ${extractDate(date)},
        Starting time: ${extractTime(date)}
        Duration time: ${durationTime}
        Location: ${location}
        Participants: ${participants.length}/${maxParticipants}
        Description: ${description}
        Lecturer name: ${lecturerName}
        Lecturer info: ${lecturerInfo}
        Lecturer pic: ${lecturerPic}`;

      const updateMessagesData = {
        emails: participants.map(participant => participant.email),
        message: 'An update has occured, here are the updated details of the lecture:\n\n' + lectureUpdatedData,
      }

      const res = await sendUpdateMessages(updateMessagesData);
      if (res.status && res.status === 200) {
        console.log(res.data.data);
      }
      else
        alert("FAIL! " + res.data);
    } catch (err) {
      console.error('An error occurred while sending update messages to the participants: ', err);
    }
  };

  if (!lecture) return <div>Loading...</div>;

  const formatDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className='edit-page'>
      <h2>Edit Lecture: {lecture.title}</h2>
      <form>
        <div>
          <label>Title: </label>
          <input type="text" id="title" defaultValue={lecture.title} />
        </div>
        <div>
          <label>Participants: </label>
          <input type="text" id="max-participants" defaultValue={lecture.maxParticipants} />
        </div>
        <div>
          <label>Date: </label>
          <input type="datetime-local" id="date" defaultValue={formatDateTimeLocal(lecture.date)} />
        </div>
        <div>
          <label>Duration Time: </label>
          <input className='create-field' defaultValue={lecture.durationTime} type={inputDurationTimeType} placeholder='Duration time' id="time" min="00:00" max="5:00" onFocus={() => { setInputDurationTimeType('time') }} onBlur={() => { document.getElementById('time').value ? setInputDurationTimeType('time') : setInputDurationTimeType('text') }} required />
        </div>
        <div>
          <label>Location: </label>
          <input type="text" id="location" defaultValue={lecture.location} />
        </div>
        <div>
          <label>Description: </label>
          <textarea id="description" defaultValue={lecture.description} />
        </div>
        <div>
          <label>Picture URL: </label>
          <input type="text" id="lecturer-picture" defaultValue={lecture.lecturerPic} />
        </div>
        <div>
          <label>Lecturer Name: </label>
          <input type="text" id="lecturer-name" defaultValue={lecture.lecturerName} />
        </div>
        <div>
          <label>Lecturer Info: </label>
          <input type="text" id="lecturer-info" defaultValue={lecture.lecturerInfo} />
        </div>

        <button type="button" onClick={editLec}>Save</button>
        <button type="button" onClick={() => window.history.back()}>Cancel</button>
        <p id="message"></p>
      </form>
    </div>
  );
}

export default EditPage;
