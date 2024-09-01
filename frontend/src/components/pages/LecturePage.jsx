import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getCreatedLectures, getJoinedLectures, joinLecture, cancelLecture, getParticipants, getParticipantsDate } from '../../services/lecService';
import { sendBroadcastMessages } from '../../services/msgService';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import Popup from 'reactjs-popup';
import '../pages/styles/LecturePage.css';
import AgeDistributionChart from '../AgeDistributionChart';
import { getForm } from '../../services/lecService';
import FormDistributionChart from '../FormDistributionChart';



function LecturePage() {
  const location = useLocation();
  const [lecture, setLecture] = useState(location.state?.lecture || {});
  const [joinedLecture, setJoinedLecture] = useState([]); // refers to the lecture that specific user joined to
  const [createdLecture, setCreatedLecture] = useState([]); // refers to the lecture that created by the specific user
  const [selectedLectureAnswers, setSelectedLectureAnswers] = useState({}); // stores selected answers for the specific lecture being joined
  const [participants, setParticipants] = useState([]); // list of the participants that joined the lecture
  const [message, setMessage] = useState(''); // state to store broadcast message
  const [showGraph, setShowGraph] = useState(false);
  const [ages, setAges] = useState([]); // stores birthdates of participants for the specific lecture being joined
  const [showForm, setShowForm] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [titles, setTitles] = useState('');
  const [activeChartIndex, setActiveChartIndex] = useState(null); // or -1 if you prefer
  const currentDate = new Date();
  const lectureDate = new Date(lecture.date);
  const navigate = useNavigate();

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

  function isExpiredLec(lec) {
    const today = new Date();
    return today > new Date(extractDate(lec.date));
  }

  const isLoggedIn = () => {
    if ((localStorage.getItem("access_token")) && (localStorage.getItem("userID")))
      return true;
    return false;
  };

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

    // if guest user trying to join lecture - move to login page
    if (!isLoggedIn())
      navigate('/login');

    try {
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
      console.log('res: ', res + "data" + res.data1);

      if (res.status && res.status === 200) {
        setJoinedLecture([...joinedLecture, id]);
        setParticipants([...participants, { _id: localStorage.getItem("userID") }])
        const updatedParticipants = [...lecture.participants, { _id: localStorage.getItem("userID") }];
        setLecture(prevLecture => ({
          ...prevLecture,
          participants: updatedParticipants,
        }));
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
        const updatedParticipants = lecture.participants.filter(participant => participant !== localStorage.getItem("userID"));
        setParticipants(lecture.participants)
        setLecture(prevLecture => ({
          ...prevLecture,
          participants: updatedParticipants,
        }));
      }
      else
        alert("FAIL! " + res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const isJoinedLecture = (id) => {
    return joinedLecture ? joinedLecture.some(lecture => lecture._id === id) : false;
  };
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

  function calculateAgesFromBirthdates(birthdates) {
    const today = new Date();
    const ages = birthdates.map(birthdate => {
      const birthDateObj = new Date(birthdate);
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();

      // Adjust age based on month difference
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }

      return age;
    });

    return ages;
  }

  const AgeGraph = async () => {
    const res = await getParticipantsDate(lecture._id);
    setAges(calculateAgesFromBirthdates(res.data));
    setShowGraph(!showGraph);

  };

  const FormGraph = async (lectureID, userID, index) => {
    try {
      const data = {
        lectureID: lectureID,
        userID: userID,
        questionIndex: index
      };

      const res = await getForm(data);
      console.log('res:', res);
      setAnswers(res); // Update state with fetched form data
      setShowForm(!showForm);
      setTitles(lecture.form[index].question);
      setActiveChartIndex(index)
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  return (
    <div className='lecture-page'>
      <h2>Lecture page</h2>
      {/* <div className="lecture"> */}
      <div className={isExpiredLec(lecture) ? "expired-lecture" : "lecture"}>
        <div className="lecture-template">
          <div className="lecture-label">Title: {lecture.title}</div>
          <div className="lecture-label">Date: {extractDate(lecture.date)}</div>
          <div className="lecture-label">Starting Time: {extractTime(lecture.date)}</div>
          <div className="lecture-label">Duration Time: {lecture.durationTime}</div>
          <div className="lecture-label">Location: {lecture.location}</div>
          <div className="lecture-label" id='participants'>Participants: {participants.length + '/' + lecture.maxParticipants}</div>
          {isCreatedLecture(lecture._id) && (
            <Popup
              trigger={<button id='show-participants'>Show participants</button>}
              position="right center"
              className='participants-popup'
            >
              <div className='participants-window'>
                <div className='participants-list'>
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
                </div>
              </div>
            </Popup>
          )}
          <div className="lecture-label">Description: {lecture.description}</div>
          {lecture.picture &&
            <div className="lecture-label"><p>Picture:</p>
              <img src={lecture.picture} alt="Lecture" className="lecture-image" />
            </div>}
          <div className="lecture-label">Lecturer name: {lecture.lecturerName}</div>
          <div className="lecture-label">Lecturer info: {lecture.lecturerInfo}</div>
          {lecture.lecturerPic &&
            <div className="lecture-label"><p>Lecturer picture:</p>
              <img src={lecture.lecturerPic} alt="Lecture" className="lecture-image" />
            </div>}
          <div>

            {!isCreatedLecture(lecture._id) && lecture.form && lecture.form.map((question, qIndex) => (
              <div key={qIndex} className='question-container'>
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
          {!isCreatedLecture(lecture._id) && lecture.maxParticipants > participants.length && (
            <>
              {lectureDate > currentDate ? (
                <button
                  id='join'
                  onClick={() => joinLec(lecture._id)}
                  disabled={isJoinedLecture(lecture._id)}
                >
                  {isJoinedLecture(lecture._id) ? "Joined" : "Join"}
                </button>
              ) : (
                <span>Expired</span>
              )}
            </>
          )}
          {isJoinedLecture(lecture._id) && (
            <button className='cancel-btn' onClick={cancelLec} id='cancel'>
              Cancel
            </button>
          )}

          {(isCreatedLecture(lecture._id) || isJoinedLecture(lecture._id)) && (
            <div className='add-to-calander-btn'>  <AddToCalendarButton
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
            </div>
          )}

          {isCreatedLecture(lecture._id) && (
            <>
              {!isExpiredLec(lecture) && <Link to={`/EditPage/${lecture.title}`} state={{ lecture }}>
                <button id='edit-btn'>Edit</button>
              </Link>}
              <Popup
                className='broadcast-popup'
                trigger={<button id='broadcast-msg-btn'>Broadcast message</button>}
                position="center"
              >
                <div className='broadcast-window'>
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
          {isCreatedLecture(lecture._id) && participants.length > 0 ? (
            <div>
              <button className='chart-btn' onClick={AgeGraph}>Age Graph</button>

              {lecture.form.length > 0 && (
                lecture.form.map((formItem, index) => (
                  <button className='chart-btn' key={index} onClick={() => FormGraph(lecture._id, localStorage.getItem("userID"), index)}>
                    Form Chart {index + 1}
                  </button>
                ))
              )}

            </div>
          ) : (
            isCreatedLecture(lecture._id) && (
              <div>No Graph available</div>
            )
          )}

          {showGraph && <AgeDistributionChart class="chart-container" ages={ages} />}
          {activeChartIndex !== null && (
            <FormDistributionChart
              class="chart-container"
              titles={titles}
              answersData={answers}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default LecturePage;
