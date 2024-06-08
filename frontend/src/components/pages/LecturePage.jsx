import React, { useEffect , useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllConferences, getCreatedConferences, getJoinedConferences, joinConference } from '../../services/conService';
import { AddToCalendarButton } from 'add-to-calendar-button-react';

function LecturePage() {
    const { lecture } = useLocation().state || {};
    const [joinedLecture, setJoinedeLecture] = useState([]); // refers to the conferences that specific user joined to
  const [createdLecture, setCreatedLecture] = useState([]); // refers to the conferences that created by the specific user
    const [selectedLectureAnswers, setselectedLectureAnswers] = useState({}); // stores selected answers for the specific conference being joined
 
    function extractDate(datetime) {
        if (!datetime) return 'N/A';
        const [date] = datetime.split("T");
        return date;
    }

    function extractTime(datetime) {
        if (!datetime) return 'N/A';
        const time = datetime.split("T")[1]?.split(".")[0]; // Extracting time part from ISO string
        return time;
    }
    useEffect(() => {
        const fetchJoinedLecture = async () => {
            try {
                const res = await getJoinedConferences();
                setJoinedeLecture(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        const fetchCreatedConferences = async () => {
            try {
              const res = await getCreatedConferences();
              setCreatedLecture(res.data);
            } catch (err) {
              console.log(err);
            }
          };

          fetchJoinedConferences();
          fetchCreatedConferences();
    } , []);

    const joinCon = async (id) => {
        try {
         
          let isValid = true;
      
          // Check each question's answer for the selected conference
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
            alert("Please select an answer for all questions before joining the conference.");
            return;
          }
      
          // If needed, you can now use selectedAnswers object containing answers selected by the user
      
          const data = { lectureID: id, selectedAnswers: selectedLectureAnswers[id] };
          console.log('hi from join conference: ', data);
          const res = await joinConference(data);
      
          if (res.status && res.status === 200)
            setJoinedeLecture([...joinedLecture, id]);
          else
            alert("FAIL! " + res.data);
      
        } catch (err) {
          console.log(err);
        }
      };

      const isJoinedConference = (id) => joinedLecture ? joinedLecture.includes(id) : false;
      const isCreatedConference = (id) => createdLecture ? createdLecture.includes(id) : false;

      const handleAnswerSelect = (event, qIndex, conferenceID) => {
        const selectedAnswer = event.target.value;
        setselectedLectureAnswers(prevState => ({
          ...prevState,
          [conferenceID]: {
            ...prevState[conferenceID],
            [qIndex]: selectedAnswer
          }
        }));
      };

    return (
        <div className='lecture-page'>
            <p className='lecture-page-title'>Lecture Details</p>
            <div className="lecture">
                <div className="lecture-template">
                    <div className="lecture-label">Title: {lecture.title || 'N/A'}</div>
                    <div className="lecture-label">Date: {extractDate(lecture.date)}</div>
                    <div className="lecture-label">Starting Time: {extractTime(lecture.startingTime)}</div>
                    <div className="lecture-label">Duration Time: {lecture.durationTime || 'N/A'}</div>
                    <div className="lecture-label">Location: {lecture.location || 'N/A'}</div>
                    <div className="lecture-label">Participants: {lecture.participants || 'N/A'}</div>
                    <div className="lecture-label">Description: {lecture.description || 'N/A'}</div>
                    <div className="lecture-label">Picture: <img src={lecture.picture} alt="Lecture" className="lecture-image" /></div>
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
                  {!isCreatedConference(lecture._id) && (
                <>
                  <button
                    onClick={() => joinCon(lecture._id)}
                    disabled={isJoinedConference(lecture._id)}
                  >
                    {isJoinedConference(lecture._id) ? "Joined" : "Join"}
                  </button>
                  {isJoinedConference(lecture._id) && (
                    <AddToCalendarButton
                    name={lecture.title}
                    options={['Apple','Google']}
                    location={lecture.location}
                    startDate={extractDate(lecture.date)}
                    endDate= {extractDate(lecture.date)}
                    startTime={extractTime(lecture.date)}
                    description={lecture.description}
                    endTime="23:30"
                    timeZone="Israel"
                  ></AddToCalendarButton>
                  )}
                </>
              )}
                </div>
            </div>
        </div>
    );
}

export default LecturePage;
