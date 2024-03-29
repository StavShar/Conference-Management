import axios from 'axios';
const backendURL = 'http://localhost:3001';

const headers = {
    headers: { token: localStorage.getItem('access_token'), userID: localStorage.getItem('userID') }
}


async function createConference(data) {
    try {
        const res = await axios.post(backendURL + "/con/createConference", { data }, headers);

        alert("Conference has been created !");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function getAllConferences() {
    try {
        const res = await axios.get(backendURL + "/con/getAllConferences", headers);
        console.log("All conferences has been retrieved !");
        return (res.data);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

//getting the list of the conferences that created by specific user
async function getCreatedConferences() {

    try {
        const res = await axios.get(backendURL + "/con/getCreatedConferences", headers);
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

//getting the list of the conferences that a specific user has been joined
async function getJoinedConferences() {

    try {
        const res = await axios.get(backendURL + "/con/getJoinedConferences", headers);
        console.log("All joined conferences has been retrieved !");
        return (res.data);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

//getting the list of the conferences that a specific user has been joined
async function joinConference(data) {

    try {
        console.log('joinConferences data: ', data)
        const res = await axios.post(backendURL + "/con/joinConference", { data }, headers);
        console.log("Join a conference has been succeed !");
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

export { createConference, getAllConferences, getCreatedConferences, getJoinedConferences, joinConference };