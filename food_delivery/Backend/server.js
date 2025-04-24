
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

// Define FoodItem Schema and Model
const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://via.placeholder.com/150",
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

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

//FOOD ITEM ROUTES

// Get all food items
app.get('/food-items', async (req, res) => {
    try {
        const foodItems = await FoodItem.find();
        res.status(200).json(foodItems);
    } catch (error) {
        console.error('Error fetching food items:', error);
        res.status(500).json({ error: 'Unable to get food items' });
    }
});

// Get a single food item by ID
app.get('/food-items/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const foodItem = await FoodItem.findById(id);
        
        if (!foodItem) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        
        res.status(200).json(foodItem);
    } catch (error) {
        console.error('Error fetching food item:', error);
        res.status(500).json({ error: 'Unable to get food item' });
    }
});


const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Modify the food item POST route to handle file uploads
app.post('/food-items', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
            return res.status(400).json({ error: 'Name, description, price, and category are required' });
        }

        // Create image URL from uploaded file or use default
        let imageUrl = 'https://via.placeholder.com/150';
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }

        const newFoodItem = new FoodItem({
            name,
            description,
            price: parseFloat(price),
            category,
            image: imageUrl,
        });

        await newFoodItem.save();
        res.status(201).json({ message: 'Food item added successfully', foodItem: newFoodItem });
    } catch (error) {
        console.error('Error adding food item:', error);
        res.status(500).json({ error: 'Error adding food item' });
    }
});

// Modify the food item PUT route to handle file uploads
app.put('/food-items/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, isAvailable } = req.body;

        // Find the existing food item
        const foodItem = await FoodItem.findById(id);
        if (!foodItem) {
            return res.status(404).json({ error: 'Food item not found' });
        }

        // Update image if a new one is uploaded
        let imageUrl = foodItem.image;
        if (req.file) {
            imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
            
            // Delete old image if it's not the default and it's in our uploads folder
            if (foodItem.image && foodItem.image.includes('/uploads/')) {
                const oldImagePath = foodItem.image.split('/uploads/')[1];
                if (oldImagePath) {
                    const fullPath = path.join(uploadDir, oldImagePath);
                    if (fs.existsSync(fullPath)) {
                        fs.unlinkSync(fullPath);
                    }
                }
            }
        }

        const updatedFoodItem = await FoodItem.findByIdAndUpdate(
            id,
            { 
                name, 
                description, 
                price: parseFloat(price), 
                category, 
                image: imageUrl,
                isAvailable: isAvailable === 'true' || isAvailable === true
            },
            { new: true }
        );

        res.status(200).json({ message: 'Food item updated successfully', foodItem: updatedFoodItem });
    } catch (error) {
        console.error('Error updating food item:', error);
        res.status(500).json({ error: 'Error updating food item' });
    }
});

// Modify the DELETE route to also delete the image file
app.delete('/food-items/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const foodItem = await FoodItem.findById(id);
        
        if (!foodItem) {
            return res.status(404).json({ error: 'Food item not found' });
        }
        
        // Delete the image file if it's in our uploads folder
        if (foodItem.image && foodItem.image.includes('/uploads/')) {
            const imagePath = foodItem.image.split('/uploads/')[1];
            if (imagePath) {
                const fullPath = path.join(uploadDir, imagePath);
                if (fs.existsSync(fullPath)) {
                    fs.unlinkSync(fullPath);
                }
            }
        }
        
        const deletedFoodItem = await FoodItem.findByIdAndDelete(id);
        res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
        console.error('Error deleting food item:', error);
        res.status(500).json({ error: 'Error deleting food item' });
    }
});