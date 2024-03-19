import {React} from 'react';
import './pages/styles/Navbar.css'
function Navbar() {
    
    return (
        <nav className="navbar">
      <a href="/" className="navbar-brand">Home</a>
      <ul className="navbar-nav">
        <li className="nav-item">
          <a href="/login" className="nav-link">Login</a>
        </li>
        <li className="nav-item">
          <a href="/register" className="nav-link">Register</a>
        </li>
        <li className="nav-item">
          <a href="/myconference" className="nav-link nav-link-special">MyConference</a>
        </li>
      </ul>
    </nav>
    );
}
export default Navbar;