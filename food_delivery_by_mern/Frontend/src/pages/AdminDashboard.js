// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function AdminDashboard() {
//     const [foodItems, setFoodItems] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [formData, setFormData] = useState({
//         name: '',
//         description: '',
//         price: '',
//         category: '',
//         image: '',
//     });
//     const [isEditing, setIsEditing] = useState(false);
//     const [currentItemId, setCurrentItemId] = useState(null);

//     const navigate = useNavigate();

//     useEffect(() => {
//         fetchFoodItems();
//     }, []);

//     const fetchFoodItems = async () => {
//         try {
//             setLoading(true);
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             const response = await axios.get('http://localhost:3001/food-items');
//             setFoodItems(response.data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching food items:', error);
//             setError('Failed to fetch food items');
//             setLoading(false);
//         }
//     };

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({
//             ...formData,
//             [name]: name === 'price' ? parseFloat(value) : value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             if (isEditing) {
//                 await axios.put(`http://localhost:3001/food-items/${currentItemId}`, formData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setIsEditing(false);
//                 setCurrentItemId(null);
//             } else {
//                 await axios.post('http://localhost:3001/food-items', formData, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//             }

//             // Reset form and refresh food items
//             setFormData({
//                 name: '',
//                 description: '',
//                 price: '',
//                 category: '',
//                 image: '',
//             });
//             fetchFoodItems();
//         } catch (error) {
//             console.error('Error saving food item:', error);
//             setError('Failed to save food item');
//         }
//     };

//     const handleEdit = (item) => {
//         setFormData({
//             name: item.name,
//             description: item.description,
//             price: item.price,
//             category: item.category,
//             image: item.image,
//         });
//         setIsEditing(true);
//         setCurrentItemId(item._id);
//     };

//     const handleDelete = async (id) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 navigate('/login');
//                 return;
//             }

//             await axios.delete(`http://localhost:3001/food-items/${id}`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             fetchFoodItems();
//         } catch (error) {
//             console.error('Error deleting food item:', error);
//             setError('Failed to delete food item');
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         navigate('/login');
//     };

//     return (
//         <div className="min-h-screen bg-gray-900 text-white p-6">
//             <div className="max-w-6xl mx-auto">
//                 <div className="flex justify-between items-center mb-8">
//                     <h1 className="text-3xl font-bold text-teal-400">Admin Dashboard</h1>
//                     <button 
//                         onClick={handleLogout} 
//                         className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
//                     >
//                         Logout
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Add/Edit Food Item Form */}
//                     <div className="lg:col-span-1">
//                         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//                             <h2 className="text-xl font-semibold mb-4 text-teal-400">
//                                 {isEditing ? 'Edit Food Item' : 'Add New Food Item'}
//                             </h2>
//                             {error && <p className="text-red-500 mb-4">{error}</p>}
//                             <form onSubmit={handleSubmit}>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium mb-1">Name</label>
//                                     <input
//                                         type="text"
//                                         name="name"
//                                         value={formData.name}
//                                         onChange={handleChange}
//                                         className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium mb-1">Description</label>
//                                     <textarea
//                                         name="description"
//                                         value={formData.description}
//                                         onChange={handleChange}
//                                         className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
//                                         rows="3"
//                                         required
//                                     ></textarea>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium mb-1">Price</label>
//                                     <input
//                                         type="number"
//                                         name="price"
//                                         value={formData.price}
//                                         onChange={handleChange}
//                                         className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
//                                         step="0.01"
//                                         required
//                                     />
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium mb-1">Category</label>
//                                     <select
//                                         name="category"
//                                         value={formData.category}
//                                         onChange={handleChange}
//                                         className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
//                                         required
//                                     >
//                                         <option value="">Select Category</option>
//                                         <option value="Appetizer">Appetizer</option>
//                                         <option value="Main Course">Main Course</option>
//                                         <option value="Dessert">Dessert</option>
//                                         <option value="Beverage">Beverage</option>
//                                     </select>
//                                 </div>
//                                 <div className="mb-4">
//                                     <label className="block text-sm font-medium mb-1">Image URL</label>
//                                     <input
//                                         type="text"
//                                         name="image"
//                                         value={formData.image}
//                                         onChange={handleChange}
//                                         className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
//                                         placeholder="https://example.com/image.jpg"
//                                     />
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button
//                                         type="submit"
//                                         className="w-full p-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition duration-300"
//                                     >
//                                         {isEditing ? 'Update Item' : 'Add Item'}
//                                     </button>
//                                     {isEditing && (
//                                         <button
//                                             type="button"
//                                             onClick={() => {
//                                                 setIsEditing(false);
//                                                 setCurrentItemId(null);
//                                                 setFormData({
//                                                     name: '',
//                                                     description: '',
//                                                     price: '',
//                                                     category: '',
//                                                     image: '',
//                                                 });
//                                             }}
//                                             className="w-full p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300"
//                                         >
//                                             Cancel
//                                         </button>
//                                     )}
//                                 </div>
//                             </form>
//                         </div>
//                     </div>

//                     {/* Food Items List */}
//                     <div className="lg:col-span-2">
//                         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
//                             <h2 className="text-xl font-semibold mb-4 text-teal-400">Food Items</h2>
//                             {loading ? (
//                                 <p>Loading food items...</p>
//                             ) : foodItems.length === 0 ? (
//                                 <p>No food items found. Add some items to get started.</p>
//                             ) : (
//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full divide-y divide-gray-700">
//                                         <thead>
//                                             <tr>
//                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                                                     Name
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                                                     Category
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                                                     Price
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
//                                                     Actions
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="divide-y divide-gray-700">
//                                             {foodItems.map((item) => (
//                                                 <tr key={item._id}>
//                                                     <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
//                                                     <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
//                                                     <td className="px-4 py-3 whitespace-nowrap">${item.price.toFixed(2)}</td>
//                                                     <td className="px-4 py-3 whitespace-nowrap">
//                                                         <div className="flex gap-2">
//                                                             <button
//                                                                 onClick={() => handleEdit(item)}
//                                                                 className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md"
//                                                             >
//                                                                 Edit
//                                                             </button>
//                                                             <button
//                                                                 onClick={() => handleDelete(item._id)}
//                                                                 className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md"
//                                                             >
//                                                                 Delete
//                                                             </button>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminDashboard;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [foodItems, setFoodItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchFoodItems();
    }, []);

    const fetchFoodItems = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:3001/food-items');
            setFoodItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching food items:', error);
            setError('Failed to fetch food items');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'price' ? parseFloat(value) : value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Create a FormData object to send the form data including the image
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            
            // Only append the image if a new one is selected
            if (selectedImage) {
                formDataToSend.append('image', selectedImage);
            }

            if (isEditing) {
                await axios.put(`http://localhost:3001/food-items/${currentItemId}`, formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setIsEditing(false);
                setCurrentItemId(null);
            } else {
                await axios.post('http://localhost:3001/food-items', formDataToSend, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            // Reset form and refresh food items
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
            });
            setSelectedImage(null);
            setImagePreview('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            fetchFoodItems();
        } catch (error) {
            console.error('Error saving food item:', error);
            setError('Failed to save food item');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
        });
        setImagePreview(item.image);
        setIsEditing(true);
        setCurrentItemId(item._id);
        setSelectedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            await axios.delete(`http://localhost:3001/food-items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchFoodItems();
        } catch (error) {
            console.error('Error deleting food item:', error);
            setError('Failed to delete food item');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentItemId(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
        });
        setSelectedImage(null);
        setImagePreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-teal-400">Admin Dashboard</h1>
                    <button 
                        onClick={handleLogout} 
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                    >
                        Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Add/Edit Food Item Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-teal-400">
                                {isEditing ? 'Edit Food Item' : 'Add New Food Item'}
                            </h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Appetizer">Appetizer</option>
                                        <option value="Main Course">Main Course</option>
                                        <option value="Dessert">Dessert</option>
                                        <option value="Beverage">Beverage</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full p-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        ref={fileInputRef}
                                    />
                                    {imagePreview && (
                                        <div className="mt-2">
                                            <img 
                                                src={imagePreview || "/placeholder.svg"} 
                                                alt="Preview" 
                                                className="h-32 w-auto object-cover rounded-md"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="w-full p-2 bg-teal-600 hover:bg-teal-700 rounded-lg transition duration-300"
                                    >
                                        {isEditing ? 'Update Item' : 'Add Item'}
                                    </button>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="w-full p-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Food Items List */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold mb-4 text-teal-400">Food Items</h2>
                            {loading ? (
                                <p>Loading food items...</p>
                            ) : foodItems.length === 0 ? (
                                <p>No food items found. Add some items to get started.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-700">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Image
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Name
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Category
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-700">
                                            {foodItems.map((item) => (
                                                <tr key={item._id}>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <img 
                                                            src={item.image || 'https://via.placeholder.com/50'} 
                                                            alt={item.name}
                                                            className="h-12 w-12 object-cover rounded-md"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{item.name}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">{item.category}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">${item.price.toFixed(2)}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item._id)}
                                                                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;