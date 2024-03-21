/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */
import React from 'react';
import './styles/RegisterStyle.css';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/authService';
import { useCookies } from "react-cookie";

function Login() {
  const navigate = useNavigate();
  const [_, setCookies] = useCookies(["access_token"]);

  const printErrorMsg = (msg) => {
    document.getElementById('message').textContent = msg;
  }

  const handleSubmit = async () => {

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    const mailValidation = (mail) => {
      const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]+$/;

      if (regex.test(mail))
        return true;
      return false;
    }


    // checking if there are empty fields
    if (!(email && password))
      printErrorMsg("Error! fields can't be empty");

    // //checking if passwords match
    // else if (password != cnfrmPassword)
    //   printErrorMsg("Error! passwords not match");

    //checking validation of email
    else if (!mailValidation(email))
      printErrorMsg("Error! email is invalid")

    else {
      printErrorMsg('');

      /* Packs data to 'JSON' format to send via web */
      const data = {
        email: email,
        password: password
      }
      console.log('Trying to login: ', JSON.stringify(data));

      const res = await login(data);
      console.log('log res ' + res)
      if (res && res.status == 200) {
        console.log('res login: ' + JSON.stringify(res.data));
        setCookies("access_token", res.data.token);
        window.localStorage.setItem("userID", res.data.userID);
        navigate("/");
      }
      else
        printErrorMsg(res);
    }
  }

  return (
    <div>
      <h2>Login Form</h2>
      <link href="https://font.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet"></link>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <form>
        <div className='reg-div'>
          <input className='reg-field' type="email" id="email" placeholder="Email" required />
          <i className='bx bxs-envelope'></i>
        </div>

        <div className='reg-div'>
          <input className='reg-field' type="password" id="password" placeholder="Password" required />
          <i className='bx bxs-lock-alt' ></i>
        </div>

        <p id="message"></p>
        <input type="button" onClick={handleSubmit} value='Login'></input>
      </form>
    </div>
  );
}

export default Login;