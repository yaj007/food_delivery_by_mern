const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');

const SECRET_KEY = 'super-secret-key';

// Connect to express app
const app = express();

// Connect to MongoDB
const dbURI = 'mongodb+srv://root:1234@cluster30.ognps4e.mongodb.net/UsersDB?retryWrites=true&w=majority&appName=CLuster30';
mongoose.connect(dbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => {
    app.listen(3001, () => {
        console.log('Server connected to port 3001 and MongoDb');
    });
})
.catch((error) => {
    console.log('Unable to connect to Server and/or MongoDB', error);
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, username, password, phoneNumber, address, fullName } = req.body;
        const { houseNo, area, city } = address; // Destructure the address fields

        if (!email || !username || !password || !phoneNumber || !houseNo || !area || !city || !fullName) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            username,
            password: hashedPassword,
            phoneNumber,
            fullName, // Include full name in user creation
            address: { houseNo, area, city }
        });
        
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error signing up' });
    }
});


// GET Registered Users
app.get('/register', authenticateToken, async (req, res) => { // Add authentication middleware
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Unable to get users' });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// CHANGE PASSWORD
app.post('/change-password', async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        await user.save()
        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract token from headers
        const decodedToken = jwt.verify(token, SECRET_KEY);
        const userId = decodedToken.userId;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
  });