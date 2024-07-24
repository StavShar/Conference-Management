/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */
import React from 'react';
import './styles/RegisterStyle.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registration } from '../../services/authService';
import bcrypt from 'bcryptjs';

function register() {
    const [inputDateOfBirthType, setInputDateOfBirthType] = useState('text');

    const navigate = useNavigate();

    const printErrorMsg = (msg) => {
        document.getElementById('message').textContent = msg;
    }

    const mailValidation = (mail) => {
        const regex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/;
        return regex.test(mail);
    }

    const phoneValidation = (phone) => {
        const regex = /^(?:\+972|0)5[0123458]\d{7}$/;
        return regex.test(phone);
    }

    const ageValidation = (dateOfBirth) => {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 18;
    }

    const handleSubmit = async () => {

        const firstname = document.getElementById('firstname').value;
        const lastname = document.getElementById('lastname').value;
        const phone = document.getElementById('phone-number').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const cnfrmPassword = document.getElementById('cnfrm-password').value;
        const dateOfBirth = new Date(document.getElementById('date').value);

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

        //checking validation of the date of birth
        else if (!ageValidation(dateOfBirth))
            printErrorMsg("Error! you must be over 18 years old")

        else {
            printErrorMsg('');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            /* Packs data to 'JSON' format to send via web */
            const data = {
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                password: hashedPassword,
                dateOfBirth: dateOfBirth,
            }
            console.log(JSON.stringify(data));

            const res = await registration(data);
            if (res && res.status == 200)
                navigate('/login');
            else
                printErrorMsg(res);
            console.log(res);
            //console.log(JSON.stringify(res));
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
                    <input className='reg-field' id="date" placeholder="date of birth" type={inputDateOfBirthType} onFocus={() => { setInputDateOfBirthType("date") }} onBlur={() => { document.getElementById('date').value ? setInputDateOfBirthType('date') : setInputDateOfBirthType('text') }} required />
                    <i className='bx bxs-calendar' ></i>
                </div>

                <p id="message"></p>
                <input id='button' type="button" onClick={handleSubmit} value='Register'></input>
            </form>
        </div>
    );
}

export default register;