import axios from 'axios';
const backendURL = 'http://localhost:3001';

const headers = {
    headers: { token: localStorage.getItem('access_token'), userID: localStorage.getItem('userID') }
}


async function createLecture(data) {
    try {
        const res = await axios.post(backendURL + "/lec/createLecture", { data }, headers);

        alert("Lecture has been created !");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

//getting the list of the Lecture that a specific user has been joined
async function getJoinedLecture() {

    try {
        const res = await axios.get(backendURL + "/lec/getJoinedLecture", headers);
        console.log("All joined Lecture has been retrieved !");
        return (res.data);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function getCreatedLectures() {

    try {
        const res = await axios.get(backendURL + "/lec/getCreatedLectures", headers);
        console.log("All created conferences has been retrieved !");
        return (res.data);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function joinLecture(data) {

    try {
        console.log('joinLecture data: ', data)
        const res = await axios.post(backendURL + "/lec/joinLecture", { data }, headers);
        console.log("Join a Lecture has been succeed !");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data);
        else if (err.response && err.response.status === 404)
            return (err.response.data);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function cancelLecture(data) {

    try {
        console.log("inside" , headers.token , headers.userID , headers.headers.token , headers.headers.userID);
        const res = await axios.post(backendURL + "/lec/cancelLecture", { data }, headers);
        console.log("Lecture has been cenceled !");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data);
        else if (err.response && err.response.status === 404)
            return (err.response.data);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function editLecture(data) {

    try {
        const res = await axios.post(backendURL + "/lec/editLecture", { data }, headers);
        console.log("Lecture has been edited !");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data);
        else if (err.response && err.response.status === 404)
            return (err.response.data);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function getParticipantsDate(data) {
    try {
        
        const res = await axios.get(backendURL + "/lec/getParticipantsDate", {
            params: { data  }, 
            headers: { token: localStorage.getItem('access_token'), userID: localStorage.getItem('userID') }
        })
        console.log("get all dates of birth !");
        return (res.data);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data);
        else if (err.response && err.response.status === 404)
            return (err.response.data);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function getForm(data) 
{
    try {
        const res = await axios.get(backendURL + "/lec/getForm", {
            params: { data  }, 
            headers: { token: localStorage.getItem('access_token'), userID: localStorage.getItem('userID') }
        }) 
        return (res.data);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data);
        else if (err.response && err.response.status === 404)
            return (err.response.data);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }

}

export { createLecture , getJoinedLecture , getCreatedLectures , joinLecture, cancelLecture , editLecture , getParticipantsDate , getForm};