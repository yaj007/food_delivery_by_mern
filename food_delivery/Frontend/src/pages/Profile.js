import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

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

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="max-w-md mx-auto p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <h1 className="text-2xl mb-6 text-green-400">User Account Information:</h1>
                {error ? (
                    <p className="text-red-500 font-bold">{error}</p>
                ) : user ? (
                    <div>
                        <div className="mb-4">
                            <strong className="text-teal-400">Full Name:</strong> <span className="text-orange-400">{user.fullName}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-teal-400">Username:</strong> <span className="text-orange-400">{user.username}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-teal-400">Email:</strong> <span className="text-orange-400">{user.email}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-teal-400">Phone Number:</strong> <span className="text-orange-400">{user.phoneNumber}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-teal-400">Address:</strong> <span className="text-orange-400">{user.address.houseNo}, {user.address.area}, {user.address.city}</span>
                        </div>
                        <div className="mb-4">
                            <strong className="text-teal-400">State:</strong> <span className="text-orange-400">{user.state}</span>
                        </div>
                        {/* Add more fields as needed */}
                    </div>
                ) : (
                    <p className="text-red-500 font-bold">Loading user information...</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
