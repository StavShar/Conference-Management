import React from 'react';
import './styles/ConferencePage.css';
import { useParams, useLocation } from 'react-router-dom';

function ConferencePage() {
    const location = useLocation();
    console.log(location);
    const { id } = location.state || {};

    const param = useParams();
    console.log('params: ', param);

    const conference = {
        title: 'title1',
        location: 'location1',
        description: 'desc1',
    }

    return (
        <div>
            <div>
                <h1>Conference page</h1>
            </div>
            <div className="conference">
                <div className="con-tomplate">
                    <div className="con-title">ID: {id}</div>
                    <div className="con-title">Title: {param.title}</div>
                    <div className="con-location">Location: {conference.location}</div>
                    <div className="con-date">Start date: </div>
                    <div className="con-date">End date: </div>
                    <div className="con-description">Description: {conference.description}</div>
                    <div> <img src={conference.picURL} alt="" /></div>
                </div>
            </div>
        </div>
    );
}

export default ConferencePage;