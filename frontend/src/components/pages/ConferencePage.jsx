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
    }

    function extractDate(datetime) {
        const [date] = datetime.split("T");
        return date;
    }

    useEffect(() => {
        if (conference.conferenceCreator === localStorage.getItem("userID")) {
            setIsCreator(true);
        }

        const fetchLectures = async () => {
            try {
                const res = await getLectures(conference._id);
                console.log('Relevant lectures has been retrieved');
                setLectures(res);
            } catch (err) {
                console.error('Error fetching lectures:', err);
            }
        };

        if (conference._id) {
            fetchLectures();
        }
    }, [conference]);

    return (
        <div className='conference-page'>
            <p className='con-page-p'>Conference page</p>
            <div className="conference">
                <div className="con-template">
                    <div className="con-title">Title: {conference.title}</div>
                    <div className='con-details'>
                        <div>Start date: {extractDate(conference.startDate)}</div>
                        <div>Location: {conference.location}</div>
                        <div>End date: {extractDate(conference.endDate)}</div>
                    </div>
                    <div className="con-description">Description: {conference.description}</div>
                    <div> <img src={conference.picURL} alt="" /></div>

                    <div style={{ marginBottom: '20px' }}>
                        {isCreator && <Link className="create-lecture-button" to={`/createlecture`} state={{ conference }}>+ Lecture</Link>}
                    </div>

                    <div className="lectures-list">
                        {lectures.length > 0 ? (
                            lectures.map(lecture => (
                                <div key={lecture._id} className="lecture-item">
                                    <Link to={`/LecturePage/${lecture.title}`} state={{ lecture }}>
                                        <div className='lec-details'>
                                            <p className='title'>{lecture.title}</p>
                                            <p className='date'>{extractDate(lecture.date)}</p>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No lectures yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConferencePage;
