import { React } from 'react';
import './pages/styles/Navbar.css'

function Navbar() {

  const logout = () => {
    window.localStorage.clear();
  };

  const isLoggedIn = () => {
    if ((localStorage.getItem("access_token")) && (localStorage.getItem("userID")))
      return true;
    return false;
  };

  return (
    <nav className="navbar">
      <a href="/" className="nav-link">Home</a>
      <ul className="navbar-nav">
        {!isLoggedIn() &&
          <>
            <li className="nav-item">
              <a href="/login" className="nav-link">Login</a>
            </li>
            <li className="nav-item">
              <a href="/register" className="nav-link">Register</a>
            </li>
          </>
        }
        {isLoggedIn() &&
          <>
            <li className="nav-item">
              <a href="/createconferences" className="nav-link nav-link-special">Create conference</a>
            </li>
            <li className="nav-item">
              <a href="/myconferences" className="nav-link nav-link-special">MyConferences</a>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link nav-link-special" onClick={() => logout()}>Logout</a>
            </li>
          </>
        }
      </ul>
    </nav>
  );
}
export default Navbar;