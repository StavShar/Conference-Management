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
        <div className="conference">
          <lu key={conference._id}>
            <div className="con-tomplate">
              <div className="con-title">Title: {conference.title}</div>
              <div className="con-date-time">
                <div className="con-date">Date: {extractDate(conference.date)}</div>
                <div className="con-starting-time">Starting time: {extractTime(conference.date)}</div>
                <div className="con-duration-time">Duratrion time: {conference.durationTime}</div>
              </div>
              <div className="con-location-participants">
                <div className="con-location">Location: {conference.location}</div>
                <div className="con-participants">Participants: 12/35</div>
              </div>
              <div className="con-description">Description: {conference.description}</div>
              <div className="con-questions">
                {conference.form && conference.form.map((question, qIndex) => (
                  <div key={qIndex}>
                    <div className="con-question">{qIndex + 1}) {question.question}
                      <select onChange={(event) => handleAnswerSelect(event, qIndex, conference._id)}></select>
                      <select className="con-select">
                        <option value="">Select an answer</option>
                        {question.answers.map((answer, aIndex) => (
                          <option key={aIndex} value={answer}>{answer}</option>

                        ))}
                      </select>
                    </div>
                  </div>
                ))}

              </div>
              <div className="con-btn">
                {!isCreatedConference(conference._id) &&
                  <button className="btn-join"
                    onClick={() => joinCon(conference._id)}
                    disabled={isJoinedConference(conference._id)}>
                    {isJoinedConference(conference._id) ? "Joined" : "Join"}
                  </button>}
                {isJoinedConference(conference._id) && (
                  <AddToCalendarButton
                    name={conference.title}
                    options={['Apple', 'Google']}
                    location={conference.location}
                    startDate={extractDate(conference.date)}
                    endDate={extractDate(conference.date)}
                    startTime={extractTime(conference.date)}
                    description={conference.description}
                    endTime="23:30"
                    timeZone="Israel"
                  ></AddToCalendarButton>
                )}
              </div>
            </div>
          </lu>
        </div>
      ))}
    </div>
  );
};

export default Home;
