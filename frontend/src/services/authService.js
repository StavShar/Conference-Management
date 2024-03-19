import axios from 'axios';
import { useNavigate } from 'react-router-dom';



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
    }
}

export { registration };