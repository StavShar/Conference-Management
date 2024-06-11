import React from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';
import { editLecture } from '../../services/lecService';

function EditPage() {
  const { lecture } = useLocation().state || {};
  const navigate = useNavigate();

  const editLec = async () => {
    const _id = lecture._id;
    const title = document.getElementById('title').value;
    const participants = lecture.participants;
    const maxParticipants = document.getElementById('max-participants').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const durationTime = document.getElementById('time').value;
    const date = new Date(document.getElementById('date').value);
    const lecturerName = document.getElementById('lecturer-name').value;
    const lecturerInfo = document.getElementById('lecturer-info').value;
    const lecturerPic = document.getElementById('lecturer-picture').value;

    const maxParticipantsValidation = (maxParticipants) => {
      if (maxParticipants >= 10 && maxParticipants <= 200) return true;
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
      printErrorMsg("Error! Max participants must be between 10 to 200");
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
      _id : _id,
      title: title,
      participants: participants,
      maxParticipants: maxParticipants,
      location: location,
      description: description,
      durationTime: durationTime,
      date: date,
      lecturerName: lecturerName,
      lecturerInfo: lecturerInfo,
      lecturerPic: lecturerPic,
    };

    console.log(data);

    const res = await editLecture(data);
    if (res && res.status === 200) {
        console.log('lecture title ' + document.getElementById('title').value);
        navigate(`/LecturePage/${document.getElementById('title').value}`,{state:{lecture: data}} );
    } else {
      printErrorMsg(res);
    }
  };

  const printErrorMsg = (msg) => {
    document.getElementById('message').textContent = msg;
  };

  if (!lecture) return <div>Loading...</div>;

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
          <input type="datetime-local" id="date" defaultValue={new Date(lecture.date).toISOString().slice(0, 16)} />
        </div>
        
        <div>
          <label>Duration Time: </label>
          <input type="text" id="time" defaultValue={lecture.durationTime} />
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
          <input type="text" id="lecturer-picture" defaultValue={lecture.picture} />
        </div>
        <div>
          <label>Lecturer Name: </label>
          <input type="text" id="lecturer-name" defaultValue={lecture.lecturerName} />
        </div>
        <div>
          <label>Lecturer Info: </label>
          <input type="text" id="lecturer-info" defaultValue={lecture.lecturerName} />
        </div>
        
        
        <button type="button" onClick={editLec}>Save</button>
        <button type="button" onClick={() => window.history.back()}>Cancel</button>
        <div id="message"></div>
      </form>
    </div>
  );
}

export default EditPage;
