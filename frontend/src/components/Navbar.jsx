import {React} from 'react';

function Navbar() {
    
    return (
        <nav className='navbar'>
            <a href='/' className='site-title'>Home</a>
            <ul>
                { (
                    <>
                        <li>
                            <a href='/login'>Login</a>
                        </li>
                        <li>
                            <a href='/signup'>SignUp</a>
                        </li>
                        <li>
                            <a href='/myconferences'>MyConference</a>
                        </li>
                        
                    </>
                )}

            </ul>
        </nav>
    );
}
export default Navbar;