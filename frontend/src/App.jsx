import './App.css';
import NavigationRoutes from './components/NavigationRoutes';
import React from 'react';
import Navbar from './components/Navbar';


function App() {
  return (
    <div>
      <Navbar />
      <NavigationRoutes />
    </div>
  )
}

export default App;
