import React, { useEffect, useState } from "react";
import { getAllConferences } from '../../services/conService';
import './styles/Home.css';

const Home = () => {
  const [conferences, setConferences] = useState([]);
  const [joinedConferences, setJoinedConferences] = useState([]);
  const [createdConferences, setCreatedConferences] = useState([]);

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

    };

    fetchConferences();
    fetchJoinedConferences();
  }, []);

  const joinConference = async (conference) => {

  };

  const isJoinedConference = (id) => joinedConferences.includes(id);

  function extractDate(datetime) {
    const [date, time] = datetime.split("T");
    return date;
  }

  function extractTime(datetime) {
    const [date, time] = datetime.split("T");
    const [hours, minutes] = time.split(":");
    return hours + ':' + minutes;
  }

  return (
    <div className="homepage">
      <h1>HomePage</h1>

      {conferences.map((conference) => (
        <div className="conference">
          <lu key={conference._id}>
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
      <p>Question {qIndex+1}   : {question.question}</p>
      <select>
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

              
              <button
                onClick={() => joinConference(conference._id)}
                disabled={isJoinedConference(conference._id)}
              >
                {isJoinedConference(conference._id) ? "Joined" : "Join"}
              </button>
            </div>
          </lu>
        </div>
      ))}

    </div>
  );
};

export default Home;