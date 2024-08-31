import { React, useState, useEffect } from 'react';
import './styles/ConferencePage.css';
import { useLocation, Link } from 'react-router-dom';
import { getLectures } from '../../services/conService';

function ConferencePage() {
    const [isCreator, setIsCreator] = useState(false);
    const { conference } = useLocation().state || {};
    const [lectures, setLectures] = useState([]);
    const data = {
        conferenceID: conference._id
    };

    function extractDate(datetime) {
        const [date] = datetime.split("T");
        return date;
    }

    function isExpiredCon(con) {
        const today = new Date();
        return today > new Date(con.endDate);
    }

    function isExpiredLec(lec) {
        const today = new Date();
        return today > new Date(extractDate(lec.date));
    }

    useEffect(() => {
        if (conference.conferenceCreator === localStorage.getItem("userID")) {
            setIsCreator(true);
        }

        const fetchLectures = async () => {
            try {
                const res = await getLectures(conference._id);
                console.log('Relevant lectures have been retrieved');
                setLectures(res);
            } catch (err) {
                console.error('Error fetching lectures:', err);
            }
        };

        if (conference._id) {
            fetchLectures();
        }
    }, [conference]);

    console.log('Conference:', conference.picURL);
    return (
        <div className='conference-page'>
            <h2>Conference page</h2>
            <div className={isExpiredCon(conference) ? "expired-conference" : "conference"}>
                <div className="con-template">
                    <div className="con-title">Title: {conference.title}</div>
                    <div className='con-details'>
                        <div>Start date: {extractDate(conference.startDate)}</div>
                        <div>Location: {conference.location}</div>
                        <div>End date: {extractDate(conference.endDate)}</div>
                    </div>
                    <div className="con-description">Description: {conference.description}</div>

                    <div style={{ marginBottom: '20px' }}>
                        {isCreator && !isExpiredCon(conference) && (
                            <Link className="create-lecture-button" to={`/createlecture`} state={{ conference }}>+ Lecture</Link>
                        )}
                    </div>
                    <div className='lec-list-title'>Lectures: </div>
                    <div className="lectures-list">
                        {lectures.length > 0 ? (
                            lectures.map(lecture => {
                                const lectureItem = (
                                    <div key={lecture._id} className={isExpiredLec(lecture) ? "expired-lecture-item" : "lecture-item"}>
                                        <div className='lec-details'>
                                            <p className='title'>{lecture.title}</p>
                                            <p className='date'>{extractDate(lecture.date)}</p>
                                        </div>
                                    </div>
                                );

                                return isCreator || !isExpiredLec(lecture) ? (
                                    <Link to={`/LecturePage/${lecture.title}`} state={{ lecture }} id='lecture'>
                                        {lectureItem}
                                    </Link>
                                ) : (
                                    lectureItem // Render without a link if the lecture is expired
                                );
                            })
                        ) : (
                            <p>No lectures yet</p>
                        )}
                    </div>
                    {
                        conference.picURL && (
                            <div className='con-picture'>
                                <img src={conference.picURL} alt="Conference" />
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default ConferencePage;
