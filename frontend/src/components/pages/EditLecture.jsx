import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { editLecture } from '../../services/lecService';
import { getParticipants } from '../../services/lecService';
import { sendUpdateMessages } from '../../services/msgService';
import './styles/EditLecture.css';
import { uploadPic } from '../../services/authService';

function EditPage() {
  const [participants, setParticipants] = useState([]); // list of the participants that joined the lecture
  const [inputDurationTimeType, setInputDurationTimeType] = useState('text');
  const [duration, setDuration] = useState({ hours: '', minutes: '' });
  const [totalMinutes, setTotalMinutes] = useState('');
  const [inputDateType, setInputDateType] = useState('text');
  const [inputType, setInputType] = useState('text');
  const [selectedFile, setSelectedFile] = useState(null);
  console.log(participants); // Output the object to the console
  console.log(JSON.stringify(participants, null, 2)); // Format with indentation
  console.log(Array.isArray(participants)); // Should log `true` if `lectures` is an array
  console.log(Object.keys(participants)); // List the keys of the object
  console.log(participants.id); // Replace `someProperty` with actual property names




  


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

  const handleHoursChange = (event) => {
    setDuration({ ...duration, hours: event.target.value });
  };

  const handleMinutesChange = (event) => {
    setDuration({ ...duration, minutes: event.target.value });
  };

  const handleFocus = () => {
    setInputType('select');
  };

  const handleBlur = () => {
    const hoursInMinutes = parseInt(duration.hours || 0) * 60;
    const minutes = parseInt(duration.minutes || 0);
    const total = hoursInMinutes + minutes;
    setTotalMinutes(total ? `${total} min` : '');
    setInputType('text');
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlUpload = async () => {
    try {
      if (!selectedFile) {
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await uploadPic(formData);
      console.log('file uploaded', res);

      return res;

    } catch (error) {
      console.log('error uploading file', error);
    }
  };

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
    const durationTime = totalMinutes;
    const date = new Date(document.getElementById('date').value);
    const lecturerName = document.getElementById('lecturer-name').value;
    const lecturerInfo = document.getElementById('lecturer-info').value;
    const lecturerPic = await handlUpload();
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

      if (durationTime => '30' && durationTime <= '300') {
        return true;
      }
      return false;
    }

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
      form: lecture.form,
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
      <h2>Edit Lecture</h2>
      <form className='edit-form'>
        <div>
          <label>Title: </label>
          <input className='edit-field' type="text" id="title" defaultValue={lecture.title} />
        </div>
        <div>
          <label>Participants: </label>
          <input className='edit-field' type="text" id="max-participants" defaultValue={lecture.maxParticipants} />
        </div>
        <div>
          <label>Date: </label>
          <input className='edit-field' type="datetime-local" id="date" defaultValue={formatDateTimeLocal(lecture.date)} />
        </div>
        <div className='create-div'>
          <label>Duration: </label>
          {inputType === 'text' ? (
            <input
              className='edit-field'
              id='duration'  // Ensure this is correct
              type='text'
              placeholder='Duration'
              value={totalMinutes}
              onFocus={handleFocus}
              readOnly
              required
            />
          ) : (
            <div onBlur={handleBlur} className='dur-div'>
              <select
                className='create-field'
                id='hours-duration'  // Ensure this is correct
                value={duration.hours}
                onChange={handleHoursChange}
                required
              >
                <option value='' disabled>
                  Hours
                </option>
                {[...Array(6).keys()].map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <select
                className='create-field'
                id='minutes-duration'  // Ensure this is correct
                value={duration.minutes}
                onChange={handleMinutesChange}
                required
              >
                <option value='' disabled>
                  Minutes
                </option>
                {[...Array(60).keys()].map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>
        <div>
          <label>Location: </label>
          <input className='edit-field' type="text" id="location" defaultValue={lecture.location} />
        </div>
        <div>
          <label>Description: </label>
          <textarea id="description" defaultValue={lecture.description} />
        </div>
        <div className='create-div'>
          <input className='create-field' type="file" onChange={handleFileChange} id="lecturer-picture" placeholder="Lecturer's picture URL" />
        </div>
        <div>
          <label>Lecturer Name: </label>
          <input className='edit-field' type="text" id="lecturer-name" defaultValue={lecture.lecturerName} />
        </div>
        <div>
          <label>Lecturer Info: </label>
          <input className='edit-field' type="text" id="lecturer-info" defaultValue={lecture.lecturerInfo} />
        </div>
        <div className='edit-btns'>
          <button className='edit-btn' id='button' type="button" onClick={editLec}>Save</button>
          <button className='edit-btn' type="button" onClick={() => window.history.back()}>Cancel</button>
        </div>
        
        <p id="message"></p>
      </form>
    </div>
  );
}

export default EditPage;
