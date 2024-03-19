/* eslint-disable */
/* the line above disables eslint check for this file (temporarily) todo:delete */
import React from 'react';
import {
    // createBrowserRouter,
    // RouterProvider,
    Routes, Route
} from 'react-router-dom';


import Navbar from './Navbar';

/** --- Pages Imports --- */
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import MyConference from './pages/MyConferences';
function NavigationRoutes() {

    /** todo: Implement later */
    // useEffect(() => {
    // }, []);
    //bool-login
    return (

        <div>

            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/home' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/Signup' element={<SignUp />} />
                <Route path='/myconferences' element={<MyConference />} />
            </Routes>

            {/* <div className='devmessage'>
                default test message from RouteNavigator.jsx element (dev.info)
            </div> */}

            {/* <Footer /> */}

        </div>
    );
}

export default NavigationRoutes;