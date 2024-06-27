import axios from 'axios';
const backendURL = 'http://localhost:3001';

async function sendBroadcastMessages(data) {
    try {
        const res = await axios.post(backendURL + "/msg/sendBroadcastMessages", { data });
        alert("broadcast messages sent successfully!");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

export { sendBroadcastMessages };