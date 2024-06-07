import React from 'react';
import { useLocation } from 'react-router-dom';

function LecturePage() {
    const { lecture } = useLocation().state || {};

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
                </div>
            </div>
        </div>
    );
}

export default LecturePage;
