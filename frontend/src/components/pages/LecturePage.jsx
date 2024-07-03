import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getCreatedLectures, getJoinedLectures, joinLecture, cancelLecture, getParticipants } from '../../services/lecService';
import { sendBroadcastMessages } from '../../services/msgService';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import Popup from 'reactjs-popup';
import '../pages/styles/LecturePage.css';

function LecturePage() {
  const { lecture } = useLocation().state || {};
  const [joinedLecture, setJoinedLecture] = useState([]); // refers to the lecture that specific user joined to
  const [createdLecture, setCreatedLecture] = useState([]); // refers to the lecture that created by the specific user
  const [selectedLectureAnswers, setSelectedLectureAnswers] = useState({}); // stores selected answers for the specific lecture being joined
  const [participants, setParticipants] = useState([]); // list of the participants that joined the lecture
  const [message, setMessage] = useState(''); // state to store broadcast message

  const data = {
    lectureID: lecture._id,
    userID: localStorage.getItem("userID")
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
    const fetchJoinedLecture = async () => {
      try {
        const res = await getJoinedLectures();
        setJoinedLecture(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCreatedLectures = async () => {
      try {
        const res = await getCreatedLectures();
        setCreatedLecture(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchParticipants = async () => {
      try {
        const res = await getParticipants(lecture._id);
        setParticipants(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJoinedLecture();
    fetchCreatedLectures();
    fetchParticipants();

  }, [lecture]);

  const joinLec = async (id) => {
    try {
      console.log('joined: ', joinedLecture);
      console.log('created: ', createdLecture);
      let isValid = true;

      // Check each question's answer for the selected lecture
      if (lecture.form) {
        lecture.form.forEach((question, qIndex) => {
          const selectedAnswer = selectedLectureAnswers[id]?.[qIndex];
          // Check if any answer is not selected
          if (!selectedAnswer || selectedAnswer === "Select an answer") {
            isValid = false;
            return;
          }
        });
      }

      if (!isValid) {
        alert("Please select an answer for all questions before joining the lecture.");
        return;
      }

      // If needed, you can now use selectedAnswers object containing answers selected by the user

      const data = { lectureID: id, selectedAnswers: selectedLectureAnswers[id] };
      console.log('hi from join lecture: ', data);
      const res = await joinLecture(data);

      if (res.status && res.status === 200) {
        setJoinedLecture([...joinedLecture, id]);
        lecture.participants.push(localStorage.getItem("userID"));
      }
      else
        alert("FAIL! " + res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const cancelLec = async () => {
    try {
      const res = await cancelLecture(data);
      if (res.status && res.status === 200) {
        setJoinedLecture(joinedLecture.filter(lecID => lecID !== lecture._id));
        lecture.participants = lecture.participants.filter(participant => participant !== localStorage.getItem("userID"));
      }
      else
        alert("FAIL! " + res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const isJoinedLecture = (id) => joinedLecture ? joinedLecture.includes(id) : false;
  const isCreatedLecture = (id) => createdLecture ? createdLecture.includes(id) : false;

  const handleAnswerSelect = (event, qIndex, lectureID) => {
    const selectedAnswer = event.target.value;
    setSelectedLectureAnswers(prevState => ({
      ...prevState,
      [lectureID]: {
        ...prevState[lectureID],
        [qIndex]: selectedAnswer
      }
    }));
  };

  const sendBroadcastMessage = async () => {
    if (!message) {
      alert("Error! The broadcast message is empty")
      return;
    }
    console.log('broadcast message: ', message);
    const emails = participants.map(participant => participant.email);

    const subject = 'Broadcast mesage'; // this is the title of the email
    const lectureData = `\n\n\nLecture details:\n  title: ${lecture.title},\n  date: ${extractDate(lecture.date)},\n  location: ${lecture.location}`; // this is the data of the lecture
    const messagesList = emails.map(email => ({
      email: email,
      subject: subject,
      message: message,
      lectureData: lectureData
    }));


    try {
      const res = await sendBroadcastMessages(messagesList);
      if (res.status && res.status === 200) {
        alert("broadcast messages sent successfully!");
        setMessage('');
        window.location.reload()
      }
      else
        alert("FAIL! " + res.data);
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className='lecture-page'>
      <p className='lecture-page-title'>Lecture Details</p>
      <div className="lecture">
        <div className="lecture-template">
          <div className="lecture-label">Title: {lecture.title}</div>
          <div className="lecture-label">Date: {extractDate(lecture.date)}</div>
          <div className="lecture-label">Starting Time: {extractTime(lecture.date)}</div>
          <div className="lecture-label">Duration Time: {lecture.durationTime}</div>
          <div className="lecture-label">Location: {lecture.location}</div>
          <div className="lecture-label">Participants: {lecture.participants.length + '/' + lecture.maxParticipants}</div>
          {isCreatedLecture(lecture._id) && (
            <Popup
              trigger={<button>Show participants</button>}
              position="right center"
            >
              {participants.length > 0 ? (
                <ol className='participants-ol'>
                  {participants.map(participant => (
                    <li key={participant._id} className="participant-item">
                      {participant.firstname} {participant.lastname}, {participant.phone}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No participants yet</p>
              )}
            </Popup>
          )}
          <div className="lecture-label">Description: {lecture.description}</div>
          <div className="lecture-label">Picture: <img src={lecture.picture} alt="Lecture" className="lecture-image" /></div>
          <div className="lecture-label">Lecturer name: {lecture.lecturerName}</div>
          <div className="lecture-label">Lecturer info: {lecture.lecturerInfo}</div>
          <div className="lecture-label">Lecturer picture: <img src={lecture.lecturerPic} alt="Lecture" className="lecturer-image" /></div>
          <div>
            {lecture.form && lecture.form.map((question, qIndex) => (
              <div key={qIndex}>
                <p>Question {qIndex + 1}: {question.question}</p>
                <select onChange={(event) => handleAnswerSelect(event, qIndex, lecture._id)}>
                  <option value="">Select an answer</option>
                  {question.answers.map((answer, aIndex) => (
                    <option key={aIndex} value={answer}>{answer}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {!isCreatedLecture(lecture._id) && (
            <>
              <button
                onClick={() => joinLec(lecture._id)}
                disabled={isJoinedLecture(lecture._id)}
              >
                {isJoinedLecture(lecture._id) ? "Joined" : "Join"}
              </button>
            </>
          )}

          {isJoinedLecture(lecture._id) && (
            <button onClick={cancelLec}>
              Cancel
            </button>
          )}

          {(isCreatedLecture(lecture._id) || isJoinedLecture(lecture._id)) && (
            <AddToCalendarButton
              name={lecture.title}
              options={['Apple', 'Google']}
              location={lecture.location}
              startDate={extractDate(lecture.date)}
              endDate={extractDate(lecture.date)}
              startTime={extractTime(lecture.date)}
              description={lecture.description}
              endTime="23:30"
              timeZone="Israel"
            />
          )}

          {isCreatedLecture(lecture._id) && (
            <>
              <Link to={`/EditPage/${lecture.title}`} state={{ lecture }}>
                <button>Edit</button>
              </Link>
              <Popup
                className='broadcast-popup'
                trigger={<button>Broadcast message</button>}
                position="center"
              >
                <div>
                  <textarea
                    className='broadcast-msg'
                    placeholder='Type the broadcast message here...'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <button className='broadcast-btn' onClick={sendBroadcastMessage}>Send</button>
                </div>
              </Popup>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LecturePage;
