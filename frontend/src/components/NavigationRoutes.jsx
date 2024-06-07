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
import Register from './pages/Register';
import Login from './pages/Login';
import MyConferences from './pages/MyConferences';
import CreateConferences from './pages/CreateConferences';
import CreateLecture from './pages/CreateLecture';
import ConferencePage from './pages/ConferencePage';
import LecturePage from './pages/LecturePage';

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
                <Route path='/register' element={<Register />} />
                <Route path='/myConferences' element={<MyConferences />} />
                <Route path='/createconferences' element={<CreateConferences />} />
                <Route path='/createLecture' element={<CreateLecture />} />
                <Route path='/ConferencePage/:title' element={<ConferencePage />} />
                <Route path='/LecturePage/:title' element={<LecturePage />} />
            </Routes>

            {/* <div className='devmessage'>
                default test message from RouteNavigator.jsx element (dev.info)
            </div> */}

            {/* <Footer /> */}

        </div>
    );
}

export default NavigationRoutes;