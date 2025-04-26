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
    const [fullName, setFullName] = useState(''); // Add fullName state
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const address = { houseNo, area, city };
        const userData = { email, username, password, phoneNumber, fullName, address }; // Include fullName in data object
        axios
            .post('http://localhost:3001/register', userData)
            .then(() => {
                alert('Registration Successful');
                resetForm();
                navigate('/login');
            })
            .catch((error) => {
                console.log('Unable to register user', error);
            });
    };

    const resetForm = () => {
        setEmail('');
        setUsername('');
        setPassword('');
        setPhoneNumber('');
        setFullName(''); // Reset fullName state
        setHouseNo('');
        setArea('');
        setCity('');
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-900 text-white'>
            <div className='w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg'>
                <h2 className='text-3xl font-semibold text-center text-teal-400 mb-6'>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>Full Name</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='text'
                            placeholder='Full Name'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>Email</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>Username</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='text'
                            placeholder='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>Password</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>Phone Number</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='text'
                            placeholder='Phone Number'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>House No.</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='text'
                            placeholder='House No.'
                            value={houseNo}
                            onChange={(e) => setHouseNo(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>Area</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='text'
                            placeholder='Area'
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium'>City</label>
                        <input
                            className='w-full mt-1 p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none'
                            type='text'
                            placeholder='City'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex justify-center'>
                        <button className='w-full p-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition duration-300'>
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
