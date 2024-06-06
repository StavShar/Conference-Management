import { React, useState, useEffect } from 'react';
import './styles/ConferencePage.css';
import { useLocation, Link } from 'react-router-dom';

function ConferencePage() {
    const [isCreator, setIsCreator] = useState(false);
    const { conference } = useLocation().state || {};
    // console.log('conference: ', conference)

    function extractDate(datetime) {
        const [date, time] = datetime.split("T");
        return date;
    }

    useEffect(() => {
        if (conference.conferenceCreator == localStorage.getItem("userID"))
            setIsCreator(true);
    },);

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
                        {isCreator && <Link class="create-lecture-button" to={`/createlecture`}
                            state={{ conference }}
                        >+ Lecture</Link>}
                    </div>
                </div>
            </div>

        </div >
    );
}

export default ConferencePage;