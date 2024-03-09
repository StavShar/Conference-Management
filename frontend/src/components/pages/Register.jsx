/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */
import React from 'react';
import './styles/RegisterStyle.css';


const handleSubmit = async () => {

    console.log("registration works");
}

function register() {
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
                    <input className='reg-field' type="text" id="username" placeholder="Username" required />
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

                <br />
                <p id="message"></p>
                <button type="button" onClick={handleSubmit}>register</button>
            </form>
        </div>
    );
}

export default register;