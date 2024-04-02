import React, { useEffect, useState } from "react";
import { getAllConferences, getCreatedConferences, getJoinedConferences, joinConference } from '../../services/conService';
import './styles/Home.css';

const Home = () => {
  const [conferences, setConferences] = useState([]); // refers to all conferences list
  const [joinedConferences, setJoinedConferences] = useState([]); // refers to the conferences that specific user joined to
  const [createdConferences, setCreatedConferences] = useState([]); // refers to the conferences that created by the specific user

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
      const data = { conferenceID: id };
      console.log('hi from join copnference: ', data)
      const res = await joinConference(data)

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

              
              {!isCreatedConference(conference._id) && <button
                onClick={() => joinCon(conference._id)}
                disabled={isJoinedConference(conference._id)}
              >
                {isJoinedConference(conference._id) ? "Joined" : "Join"}
              </button>}
            </div>
          </lu>
        </div>
      ))}

    </div>
  );
};

export default Home;