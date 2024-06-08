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

export { createLecture , getJoinedLecture };