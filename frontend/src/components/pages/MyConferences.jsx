import React, { useEffect, useState } from "react";
import '../pages/styles/MyConferences.css';
import { getCreatedConferences } from '../../services/conService';
import { getJoinedLectures } from '../../services/lecService';
import { useNavigate, Link } from 'react-router-dom';

function MyConferences() {
  const [createdConferences, setCreatedConferences] = useState([]); // refers to the conferences that created by the specific user
  const [joinedLectures, setJoinedLectures] = useState([]); // refers to the lectures that a specific user has joined to

  const navigate = useNavigate();

  function extractDate(datetime) {
    const [date] = datetime.split("T");
    return date;
  }

  useEffect(() => {

    const fetchJoinedLectures = async () => {
      try {
        const res = await getJoinedLectures();
        if (res.status == 403) {
          window.localStorage.clear();
          navigate('/login');
          window.location.reload();
        }
        else {
          setJoinedLectures(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCreatedConferences = async () => {
      try {
        const res = await getCreatedConferences();
        if (res.status == 403) {
          window.localStorage.clear();
          navigate('/login');
          window.location.reload();
        }
        else {
          setCreatedConferences(res.data);
        }
      } catch (err) {
        console.log(err);
      }

    };

    fetchJoinedLectures();
    fetchCreatedConferences();
  }, []);
  console.log('createdcon: ', createdConferences)
  console.log('joinedlec: ', joinedLectures)
  return (
    <div>
      <div>
        <h2>My Conferences Page</h2>
      </div>

      <div className='my-conferences'>

        <div className='lectures'>
          <h1>lectures I joined:</h1>
          <div className="con-lec-list">
            {joinedLectures.length > 0 ? (
              joinedLectures.map(lecture => (
                <div key={lecture._id} className="con-lec-item">
                  <Link to={`/LecturePage/${lecture.title}`} state={{ lecture }}>
                    <div className='con-lec-details'>
                      <p className='title'>{lecture.title}</p>
                      <p className='date'>{extractDate(lecture.date)}</p>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No joined lectures yet</p>
            )}
          </div>
        </div>

        <div className='conferences'>
          <h1>conferences created by me:</h1>
          <div className="con-lec-list">
            {createdConferences.length > 0 ? (
              createdConferences.map(conference => (
                <div key={conference._id} className="con-lec-item">
                  <Link to={`/ConferencePage/${conference.title}`} state={{ conference }}>
                    <div className='con-lec-details' >
                      <p className='title'>{conference.title}</p>
                    </div>
                  </Link>

                  <Link className="create-lecture-button" to={`/createlecture`} state={{ conference }}>+ Lecture</Link>
                </div>
              ))
            ) : (
              <p>No joined lectures yet</p>
            )}
          </div>
        </div>

      </div >
    </div >
  );
}

export default MyConferences;
