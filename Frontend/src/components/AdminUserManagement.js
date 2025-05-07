import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3001/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role || 'user'
    });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({
      fullName: '',
      email: '',
      phoneNumber: '',
      role: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.put(`http://localhost:3001/admin/users/${editingUser._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update the user in the local state
      setUsers(users.map(user => 
        user._id === editingUser._id ? { ...user, ...formData } : user
      ));

      handleCancelEdit();
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await axios.delete(`http://localhost:3001/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the user from the local state
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  return (
    <div className="bg-gray-800 dark:bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-teal-400 dark:text-teal-600">User Management</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700 dark:divide-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 dark:divide-gray-300">
              {users.map(user => (
                <tr key={user._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingUser && editingUser._id === user._id ? (
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="p-1 bg-gray-700 dark:bg-gray-200 rounded-md w-full"
                      />
                    ) : (
                      user.fullName
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingUser && editingUser._id === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-1 bg-gray-700 dark:bg-gray-200 rounded-md w-full"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingUser && editingUser._id === user._id ? (
                      <input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="p-1 bg-gray-700 dark:bg-gray-200 rounded-md w-full"
                      />
                    ) : (
                      user.phoneNumber
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingUser && editingUser._id === user._id ? (
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="p-1 bg-gray-700 dark:bg-gray-200 rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-blue-600 text-white'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {editingUser && editingUser._id === user._id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateUser}
                          className="p-1 bg-green-600 text-white rounded-md"
                          title="Save"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 bg-gray-600 text-white rounded-md"
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 bg-blue-600 text-white rounded-md"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1 bg-red-600 text-white rounded-md"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUserManagement;