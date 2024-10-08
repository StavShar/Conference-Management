import axios from 'axios';
const backendURL = 'https://conference-management.onrender.com';

async function registration(data) {
    try {
        const res = await axios.post(backendURL + "/auth/register", { data });
        alert("Registration successfully!");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message); //{ printErrorMsg(JSON.stringify(err.response.data.message)); console.log("hello") }
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function login(data) {
    try {
        const res = await axios.post(backendURL + "/auth/login", { data });
        alert("Login successfully!");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function deleteUser(data) {
    try {
        const res = await axios.delete(backendURL + "/auth/deleteUser", { data });
        alert("User has been deleted!");
        return (res);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

async function uploadPic(data) {
    console.log(data);
    try {
        const res = await axios.post(backendURL + "/pic/upload", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert("Picture uploaded successfully!");

        console.log('file uploaded', res.data.fileURL + " adar " + res);

        return (res.data.fileURL);
    } catch (err) {
        if (err.response && err.response.status === 400)
            return (err.response.data.message);
        else
            console.error(err);
        return (err.message); // returning "network error" if server is down
    }
}

export { registration, login, deleteUser, uploadPic };
