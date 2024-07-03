import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getCreatedLectures, getJoinedLecture, joinLecture, cancelLecture,getParticipantsDate } from '../../services/lecService';
import { AddToCalendarButton } from 'add-to-calendar-button-react';
import  AgeDistributionChart  from '../AgeDistributionChart';
import { getForm } from '../../services/lecService';
import FormDistributionChart from '../FormDistributionChart';
import './styles/LecturePage.css';


function LecturePage() {
  const { lecture } = useLocation().state || {};
  const [joinedLecture, setJoinedeLecture] = useState([]); // refers to the lecture that specific user joined to
  const [createdLecture, setCreatedLecture] = useState([]); // refers to the lecture that created by the specific user
  const [selectedLectureAnswers, setselectedLectureAnswers] = useState({}); // stores selected answers for the specific lecture being joined
  const [showGraph, setShowGraph] = useState(false);
  const [ages, setAges] = useState([]); // stores birthdates of participants for the specific lecture being joined
  const [showForm, setShowForm] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [titles, setTitles] = useState('');

  console.log('lecture: ', lecture.answers);

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
    const time = new Date(datetime).toISOString().split('T')[1].split(':');
    return `${time[0]}:${time[1]}`;
  }

  useEffect(() => {
    const fetchJoinedLecture = async () => {
      try {
        const res = await getJoinedLecture();
        setJoinedeLecture(res.data);
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

    fetchJoinedLecture();
    fetchCreatedLectures();

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
      console.log('res: ', res + "data" + res.data1);

      if (res.status && res.status === 200)
        {
        setJoinedeLecture([...joinedLecture, id]);
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
      if (res.status && res.status === 200)
        {
        setJoinedeLecture(joinedLecture.filter(lecID => lecID !== lecture._id));
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
    setselectedLectureAnswers(prevState => ({
      ...prevState,
      [lectureID]: {
        ...prevState[lectureID],
        [qIndex]: selectedAnswer
      }
    }));
  };

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
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  return (
    <div className='lecture-page'>
      <p className='lecture-page-title'>Lecture Details</p>
      <div className="lecture">
        <div className="lecture-template">
          <div className="lecture-label">Title: {lecture.title}</div>
        <div className="lecture-label">Date: {extractDate(lecture.date)}</div>
        <div className="lecture-label">Starting Time: {extractTime(lecture.date)}</div>
          <div className="lecture-label">Duration Time: {lecture.durationTime }</div>
          <div className="lecture-label">Location: {lecture.location}</div>
          <div className="lecture-label">Participants: {lecture.participants.length + '/' + lecture.maxParticipants}</div>
          <div className="lecture-label">Description: {lecture.description}</div>
          <div className="lecture-label">Picture: <img src={lecture.lecturerPic} alt="Lecture" className="lecture-image" /></div>
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
            <Link to={`/EditPage/${lecture.title}`} state={{lecture}}>
              <button>Edit</button>
            </Link>
          )}
          {isCreatedLecture(lecture._id) && lecture.participants.length > 0 ? (
            <div>
            <button onClick={AgeGraph}>Age Graph</button>
            
            {lecture.form.length > 0 && (
  lecture.form.map((formItem, index) => (
    <button key={index} onClick={() => FormGraph(lecture._id, localStorage.getItem("userID"), index)}>
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
          
         {showGraph && <AgeDistributionChart ages={ages} />}
         {showForm && <FormDistributionChart titles={titles} answersData={answers} />}
          
        </div>
      </div>
    </div>
  );
}

export default LecturePage;
