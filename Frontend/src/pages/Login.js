import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            alert('Login successful');
            setUsername('');
            setPassword('');
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.error('Login Error', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 transition-colors duration-300">
            <div className="w-full max-w-md bg-gray-800 dark:bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-semibold text-center text-teal-400 dark:text-teal-600 mb-6">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-teal-400 dark:text-teal-600">Username</label>
                        <input
                            className="w-full mt-1 p-2 rounded-lg bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-teal-400 dark:text-teal-600">Password</label>
                        <input
                            className="w-full mt-1 p-2 rounded-lg bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full p-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition duration-300"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
