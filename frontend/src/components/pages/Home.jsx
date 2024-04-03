import React, { useEffect, useState } from "react";
import { getAllConferences, getCreatedConferences, getJoinedConferences, joinConference } from '../../services/conService';
import { AddToCalendarButton } from 'add-to-calendar-button-react';

import './styles/Home.css';


const Home = () => {
  const [conferences, setConferences] = useState([]); // refers to all conferences list
  const [joinedConferences, setJoinedConferences] = useState([]); // refers to the conferences that specific user joined to
  const [createdConferences, setCreatedConferences] = useState([]); // refers to the conferences that created by the specific user
  const [selectedConferenceAnswers, setSelectedConferenceAnswers] = useState({}); // stores selected answers for the specific conference being joined

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const res = await getAllConferences();
        setConferences(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchJoinedConferences = async () => {
      try {
        const res = await getJoinedConferences();
        setJoinedConferences(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCreatedConferences = async () => {
      try {
        const res = await getCreatedConferences();
        setCreatedConferences(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConferences();
    fetchJoinedConferences();
    fetchCreatedConferences();
  }, []);

  const joinCon = async (id) => {
    try {
      const selectedConference = conferences.find(conference => conference._id === id);
      if (!selectedConference) {
        console.log("Conference not found");
        return;
      }
  
      let isValid = true;
  
      // Check each question's answer for the selected conference
      if (selectedConference.form) {
        selectedConference.form.forEach((question, qIndex) => {
          const selectedAnswer = selectedConferenceAnswers[id]?.[qIndex];
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
  
      const data = { conferenceID: id, selectedAnswers: selectedConferenceAnswers[id] };
      console.log('hi from join conference: ', data);
      const res = await joinConference(data);
  
      if (res.status && res.status === 200)
        setJoinedConferences([...joinedConferences, id]);
      else
        alert("FAIL! " + res.data);
  
    } catch (err) {
      console.log(err);
    }
  };
  
  const isJoinedConference = (id) => joinedConferences ? joinedConferences.includes(id) : false;
  const isCreatedConference = (id) => createdConferences ? createdConferences.includes(id) : false;

  function extractDate(datetime) {
    const [date, time] = datetime.split("T");
    return date;
  }

  function extractTime(datetime) {
    const [date, time] = datetime.split("T");
    const [hours, minutes] = time.split(":");
    return hours + ':' + minutes;
  }

  const handleAnswerSelect = (event, qIndex, conferenceID) => {
    const selectedAnswer = event.target.value;
    setSelectedConferenceAnswers(prevState => ({
      ...prevState,
      [conferenceID]: {
        ...prevState[conferenceID],
        [qIndex]: selectedAnswer
      }
    }));
  };


 


  return (
    <div className="homepage">
      <h1>HomePage</h1>

      {conferences.map((conference) => (
        <div className="conference" key={conference._id}>
          <ul>
            <div>
              <h1>Title: {conference.title}</h1>
              <p>Participants: temporary unavailable</p>
              <p>Location: {conference.location}</p>
              <p>Description: {conference.description}</p>
              <p>Duratrion time: {conference.durationTime}</p>
              <p>Date: {extractDate(conference.date)}</p>
              <p>Starting time: {extractTime(conference.date)}</p>
              <div>
                <div>
                  <div>
                    {conference.form && conference.form.map((question, qIndex) => (
                      <div key={qIndex}>
                        <p>Question {qIndex + 1}: {question.question}</p>
                        <select onChange={(event) => handleAnswerSelect(event, qIndex, conference._id)}>
                          <option value="">Select an answer</option>
                          {question.answers.map((answer, aIndex) => (
                            <option key={aIndex} value={answer}>{answer}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
  
              {!isCreatedConference(conference._id) && (
                <>
                  <button
                    onClick={() => joinCon(conference._id)}
                    disabled={isJoinedConference(conference._id)}
                  >
                    {isJoinedConference(conference._id) ? "Joined" : "Join"}
                  </button>
                  {isJoinedConference(conference._id) && (
                    <AddToCalendarButton
                    name={conference.title}
                    options={['Apple','Google']}
                    location={conference.location}
                    startDate={extractDate(conference.date)}
                    endDate= {extractDate(conference.date)}
                    startTime={extractTime(conference.date)}
                    description={conference.description}
                    endTime="23:30"
                    timeZone="Israel"
                  ></AddToCalendarButton>
                  )}
                </>
              )}
            </div>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Home;
