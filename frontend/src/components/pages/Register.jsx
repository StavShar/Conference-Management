/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */
import React from 'react';
import './styles/RegisterStyle.css';
import { useState } from 'react';


function register() {
    const [creator, setCreator] = useState(false);

    const creatorToggler = () => {
        if (creator)
            setCreator(false);
        else
            setCreator(true);
    }

    const printErrorMsg = (msg) => {
        document.getElementById('message').textContent = msg;
    }

    const handleSubmit = async () => {

        let firstname = document.getElementById('firstname').value;
        let lastname = document.getElementById('lastname').value;
        let phone = document.getElementById('phone-number').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        let cnfrmPassword = document.getElementById('cnfrm-password').value;
        let dateOfBirth = document.getElementById('date').value;

        const mailValidation = (mail) => {
            const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+.[a-zA-Z]+$/;

            if (regex.test(mail))
                return true;
            return false;
        }

        const phoneValidation = (phone) => {
            const regex = /^-?\d+$/;

            if (regex.test(phone))
                return true;
            return false;
        }

        // checking if there are empty fields
        if (!(firstname && lastname && phone && email && password && cnfrmPassword && dateOfBirth))
            printErrorMsg("Error! fields can't be empty");

        //checking if passwords match
        else if (password != cnfrmPassword)
            printErrorMsg("Error! passwords not match");

        //checking validation of phone number
        else if (!phoneValidation(phone))
            printErrorMsg("Error! phone number is invalid")

        //checking validation of email
        else if (!mailValidation(email))
            printErrorMsg("Error! email is invalid")

        else {
            printErrorMsg('');

            /* Packs data to 'JSON' format to send via web */
            const data = {
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                password: password,
                dateOfBirth: dateOfBirth
            }
            console.log(JSON.stringify(data));

        }

    }

    return (
        <div>
            <h2>Registration Form</h2>
            <link href="https://font.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet"></link>
            <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
            <form>
                <div className='reg-div'>
                    <input className='reg-field' type="text" id="firstname" placeholder="First name" required />
                    <i className='bx bxs-user'></i>
                </div>

                <div className='reg-div'>
                    <input className='reg-field' type="text" id="lastname" placeholder="Last name" required />
                    <i className='bx bxs-user' ></i>
                </div>

                <div className='reg-div'>
                    <input className='reg-field' type="text" id="phone-number" placeholder="Phone number" required />
                    <i className='bx bxs-phone' ></i>
                </div>

                <div className='reg-div'>
                    <input className='reg-field' type="email" id="email" placeholder="Email" required />
                    <i className='bx bxs-envelope'></i>
                </div>

                <div className='reg-div'>
                    <input className='reg-field' type="password" id="password" placeholder="Password" required />
                    <i className='bx bxs-lock-alt' ></i>
                </div>

                <div className='reg-div'>
                    <input className='reg-field' type="password" id="cnfrm-password" placeholder="Confirm password" required />
                    <i className='bx bxs-lock-alt' ></i>
                </div>

                <div className='reg-div'>
                    <input className='reg-field' type="date" placeholder="date of birth" id="date" required />
                    <i className='bx bxs-calendar' ></i>
                </div>

                <div className='checkbox-div'>
                    <input className='checkbox-field' type="checkbox" onClick={creatorToggler} />
                    <label className='checkbox-label'>I'm a conference creator (optional)</label>
                </div>

                <p id="message"></p>
                <input type="button" onClick={handleSubmit} value='Register'></input>
            </form>
        </div>
    );
}

export default register;