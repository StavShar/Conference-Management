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

async function getAllConferences(data) {
    // try {
    //     const res = await axios.post(backendURL + "/auth/login", { data });
    //     alert("Login successfully!");
    //     return (res);
    // } catch (err) {
    //     if (err.response && err.response.status === 400)
    //         return (err.response.data.message);
    //     else
    //         console.error(err);
    //     return (err.message); // returning "network error" if server is down
    // }
}

export { createConference, getAllConferences };