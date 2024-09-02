import axios from 'axios';
const backendURL = 'https://conference-management.onrender.com';

async function sendBroadcastMessages(data) {
    try {
        const res = await axios.post(backendURL + "/msg/sendBroadcastMessages", { data });
        return (res);

    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function sendUpdateMessages(data) {
    try {
        const res = await axios.post(backendURL + "/msg/sendUpdateMessages", { data });
        return (res);

    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}




export { sendBroadcastMessages, sendUpdateMessages };