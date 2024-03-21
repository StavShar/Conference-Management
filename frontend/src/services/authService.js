import axios from 'axios';
const backendURL = 'http://localhost:3001';

async function registration(data) {
    try {
        const res = await axios.post(backendURL + "/auth/register", { data });
        alert("Registration successfully!");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (JSON.stringify(err.response.data.message)); //{ printErrorMsg(JSON.stringify(err.response.data.message)); console.log("hello") }
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}


async function loginAuth(data) {
    try {
        const res = await axios.post(backendURL + "/auth/loginAuth", { data });
        alert("Login successfully!");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (JSON.stringify(err.response.data.message)); //{ printErrorMsg(JSON.stringify(err.response.data.message)); console.log("hello") }
        else
            console.error(err);
    }
}


export { registration, loginAuth };