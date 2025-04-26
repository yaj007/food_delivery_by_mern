import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/change-password', formData);
            setSuccessMessage(response.data.message);
            setError('');
            setFormData({
                email: '',
                currentPassword: '',
                newPassword: ''
            });
        } catch (error) {
            console.error('Error:', error.response?.data?.error || error.message);
            setError('An error occurred, please try again later');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 dark:bg-gray-100 flex items-center justify-center transition-colors duration-300">
            <div className="max-w-md mx-auto p-6 bg-gray-800 dark:bg-white border border-gray-700 dark:border-gray-300 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl mb-6 font-bold text-green-400 dark:text-green-600">Change Password</h2>
                {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
                {successMessage && <p className="text-green-400 dark:text-green-600 text-sm italic mb-4">{successMessage}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-teal-400 dark:text-teal-600 text-sm font-bold mb-2">Email:</label>
                        <input
                            className="bg-gray-700 dark:bg-gray-100 border border-gray-600 dark:border-gray-300 rounded w-full py-2 px-3 text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-teal-400 dark:text-teal-600 text-sm font-bold mb-2">Current Password:</label>
                        <input
                            className="bg-gray-700 dark:bg-gray-100 border border-gray-600 dark:border-gray-300 rounded w-full py-2 px-3 text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600"
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-teal-400 dark:text-teal-600 text-sm font-bold mb-2">New Password:</label>
                        <input
                            className="bg-gray-700 dark:bg-gray-100 border border-gray-600 dark:border-gray-300 rounded w-full py-2 px-3 text-white dark:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-600"
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
                            type="submit"
                        >
                            Change Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
