const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ 
    userId: {
        type: String,
        default: function() {
            return uuidv4(); // Generate a new UUID
        },
        unique: true // Ensure the userId is unique
    },
    email: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true }, // New field for full name
    phoneNumber: { type: String, required: true },
    address: {
        houseNo: { type: String, required: true },
        area: { type: String, required: true },
        city: { type: String, required: true }
    },
    state: {
        type: String,
        default: 'Bangladesh',
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
