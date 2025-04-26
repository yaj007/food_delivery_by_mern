import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const isUserSignedIn = !!localStorage.getItem('token');
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => {
        // Get theme preference from localStorage or default to dark
        return localStorage.getItem('theme') === 'dark' || 
              (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        // Apply the theme class to the document
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <nav className='flex justify-around p-3 border-b border-zinc-800 items-center bg-[#1a1a1a]/90 text-zinc-300 dark:bg-gray-100 dark:text-gray-800'>
            <Link to='/'><h1 className='text-3xl'>TastyTracks</h1></Link>
            <div className='flex items-center gap-6'>
                <ul className='flex gap-6'>
                    {isUserSignedIn ? (
                        <>
                            <Link to='/profile'><li>Profile</li></Link>
                            <Link to='/change-password'><li>ChangePassword</li></Link>
                            <Link to='/admin'><li>Admin</li></Link>
                            <li><button onClick={handleSignOut}>Sign Out</button></li>
                        </>
                    ) : (
                        <>
                            <Link to='/login'><li>Login</li></Link>
                            <Link to='/signup'><li>Signup</li></Link>
                        </>
                    )}
                </ul>
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full bg-gray-800 dark:bg-gray-200"
                    aria-label="Toggle dark mode"
                >
                    {darkMode ? (
                        <span className="text-yellow-300">☀️</span>
                    ) : (
                        <span className="text-gray-800">🌙</span>
                    )}
                </button>
            </div>
        </nav>
    );
}

export default Navbar;