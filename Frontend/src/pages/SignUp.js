import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [houseNo, setHouseNo] = useState('');
    const [area, setArea] = useState('');
    const [city, setCity] = useState('');
    const [fullName, setFullName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const address = { houseNo, area, city };
        const userData = { email, username, password, phoneNumber, fullName, address };
        axios
            .post('http://localhost:3001/register', userData)
            .then(() => {
                alert('Registration Successful');
                resetForm();
                navigate('/login');
            })
            .catch((error) => {
                console.log('Unable to register user', error);
                alert('Registration failed. Try again.');
            });
    };

    const resetForm = () => {
        setEmail('');
        setUsername('');
        setPassword('');
        setPhoneNumber('');
        setFullName('');
        setHouseNo('');
        setArea('');
        setCity('');
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 transition-colors duration-300'>
            <div className='w-full max-w-md bg-gray-800 dark:bg-white p-8 rounded-lg shadow-lg'>
                <h2 className='text-3xl font-semibold text-center text-teal-400 dark:text-teal-600 mb-6'>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    {[
                        { label: 'Full Name', value: fullName, setter: setFullName, type: 'text' },
                        { label: 'Email', value: email, setter: setEmail, type: 'email' },
                        { label: 'Username', value: username, setter: setUsername, type: 'text' },
                        { label: 'Password', value: password, setter: setPassword, type: 'password' },
                        { label: 'Phone Number', value: phoneNumber, setter: setPhoneNumber, type: 'text' },
                        { label: 'House No.', value: houseNo, setter: setHouseNo, type: 'text' },
                        { label: 'Area', value: area, setter: setArea, type: 'text' },
                        { label: 'City', value: city, setter: setCity, type: 'text' }
                    ].map(({ label, value, setter, type }, i) => (
                        <div className='mb-4' key={i}>
                            <label className='block text-sm font-medium text-teal-400 dark:text-teal-600'>{label}</label>
                            <input
                                className='w-full mt-1 p-2 rounded-lg bg-gray-700 text-white dark:bg-gray-200 dark:text-gray-900 focus:ring-2 focus:ring-teal-500 focus:outline-none'
                                type={type}
                                placeholder={label}
                                value={value}
                                onChange={(e) => setter(e.target.value)}
                                required
                            />
                        </div>
                    ))}

                    <div className='flex justify-center'>
                        <button
                            type='submit'
                            className='w-full p-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition duration-300'
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
