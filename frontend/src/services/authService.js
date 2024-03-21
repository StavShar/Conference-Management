import axios from 'axios';

async function registration(data) {
    try {
        const res = await axios.post("http://localhost:3001/auth/register", { data });
        alert("Registration Completed!");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (JSON.stringify(err.response.data.message)); //{ printErrorMsg(JSON.stringify(err.response.data.message)); console.log("hello") }
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

export { registration };