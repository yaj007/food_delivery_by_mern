import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: {
            houseNo: '',
            area: '',
            city: ''
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('No token found');
                    return;
                }

                const response = await axios.get('http://localhost:3001/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 200) {
                    setUser(response.data);
                    setFormData({
                        fullName: response.data.fullName,
                        email: response.data.email,
                        phoneNumber: response.data.phoneNumber,
                        address: {
                            houseNo: response.data.address.houseNo,
                            area: response.data.address.area,
                            city: response.data.address.city
                        }
                    });
                } else {
                    setError('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Failed to fetch user data');
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found');
                return;
            }

            const response = await axios.put('http://localhost:3001/profile', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setUser(response.data.user);
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setError(error.response?.data?.error || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 dark:bg-gray-100 flex items-center justify-center">
            <div className="max-w-md mx-auto p-6 bg-gray-800 dark:bg-white border border-gray-700 dark:border-gray-300 rounded-lg shadow-lg">
                <h1 className="text-2xl mb-6 text-green-400 dark:text-green-600">User Account Information:</h1>
                
                {error ? (
                    <p className="text-red-500 font-bold">{error}</p>
                ) : user ? (
                    isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-teal-400 dark:text-teal-600 mb-1">Full Name:</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-200 border border-gray-600 dark:border-gray-400 rounded text-white dark:text-gray-800"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-teal-400 dark:text-teal-600 mb-1">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-200 border border-gray-600 dark:border-gray-400 rounded text-white dark:text-gray-800"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-teal-400 dark:text-teal-600 mb-1">Phone Number:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-200 border border-gray-600 dark:border-gray-400 rounded text-white dark:text-gray-800"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-teal-400 dark:text-teal-600 mb-1">House No:</label>
                                <input
                                    type="text"
                                    name="address.houseNo"
                                    value={formData.address.houseNo}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-200 border border-gray-600 dark:border-gray-400 rounded text-white dark:text-gray-800"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-teal-400 dark:text-teal-600 mb-1">Area:</label>
                                <input
                                    type="text"
                                    name="address.area"
                                    value={formData.address.area}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-200 border border-gray-600 dark:border-gray-400 rounded text-white dark:text-gray-800"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-teal-400 dark:text-teal-600 mb-1">City:</label>
                                <input
                                    type="text"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 bg-gray-700 dark:bg-gray-200 border border-gray-600 dark:border-gray-400 rounded text-white dark:text-gray-800"
                                    required
                                />
                            </div>
                            
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex-1"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div className="mb-4">
                                <strong className="text-teal-400 dark:text-teal-600">Full Name:</strong> <span className="text-orange-400 dark:text-orange-600">{user.fullName}</span>
                            </div>
                            <div className="mb-4">
                                <strong className="text-teal-400 dark:text-teal-600">Username:</strong> <span className="text-orange-400 dark:text-orange-600">{user.username}</span>
                            </div>
                            <div className="mb-4">
                                <strong className="text-teal-400 dark:text-teal-600">Email:</strong> <span className="text-orange-400 dark:text-orange-600">{user.email}</span>
                            </div>
                            <div className="mb-4">
                                <strong className="text-teal-400 dark:text-teal-600">Phone Number:</strong> <span className="text-orange-400 dark:text-orange-600">{user.phoneNumber}</span>
                            </div>
                            <div className="mb-6">
                                <strong className="text-teal-400 dark:text-teal-600">Address:</strong> <span className="text-orange-400 dark:text-orange-600">{user.address.houseNo}, {user.address.area}, {user.address.city}</span>
                            </div>
                            
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )
                ) : (
                    <p className="text-red-500 font-bold">Loading user information...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;