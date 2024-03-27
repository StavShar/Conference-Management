import { React } from 'react';
import './pages/styles/Navbar.css'
import { useCookies } from "react-cookie";

function Navbar() {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
  };

  return (
    <nav className="navbar">
      <a href="/" className="navbar-brand">Home</a>
      <ul className="navbar-nav">
        {!cookies.access_token &&
          <>
            <li className="nav-item">
              <a href="/login" className="nav-link">Login</a>
            </li>
            <li className="nav-item">
              <a href="/register" className="nav-link">Register</a>
            </li>
          </>
        }
        {cookies.access_token &&
          <>
            <li className="nav-item">
              <a href="/createconferences" className="nav-link nav-link-special">Create conferences</a>
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