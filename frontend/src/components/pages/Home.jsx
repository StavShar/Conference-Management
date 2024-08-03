import React, { useEffect, useState } from "react";
import { getAllConferences, getCreatedConferences, joinConference } from '../../services/conService';
import { Link } from 'react-router-dom';

import './styles/Home.css';


const Home = () => {
  const [conferences, setConferences] = useState([]); // refers to all conferences list

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const res = await getAllConferences();
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const validConferences = res.data.filter(conference => {
          const endDate = new Date(conference.endDate);

          return endDate >= currentDate;
        });

        setConferences(validConferences);
      } catch (err) {
        console.log(err);
      }
    };

    fetchConferences();
  }, []);

  function extractDate(datetime) {
    const [date, time] = datetime.split("T");
    return date;
  }

  return (
    <div className="homepage">
      <p className="home-p">HomePage</p>

      {conferences && conferences.length > 0 ? (
        conferences.map((conference) => (
          <div className="conference">
            <lu key={conference._id}>
              <div className="con-tomplate">
                <div className="con-title">Title: {conference.title}</div>
                <div className="con-location">Location: {conference.location}</div>
                <div className="con-date">Start date: {extractDate(conference.startDate)}</div>
                <div className="con-date">End date: {extractDate(conference.endDate)}</div>
                <div className="con-description">Description: {conference.description}</div>
                <div> <img src={conference.picURL} alt="" /></div>
                <div><Link to={`/ConferencePage/${conference.title}`} id={`${conference.title}`}
                  state={{ conference }}
                >More info...</Link></div>
              </div>
            </lu>
          </div>
        ))
      ) : (
        <div className="no-conferences">There are no conferences available</div>
      )}
    </div>
  );
};

export default Home;
