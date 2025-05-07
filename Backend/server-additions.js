// This file contains all the backend additions needed for the new features
// You'll need to integrate these into your existing server.js file

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ==================== MODELS ====================

// Wishlist Model
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem'
  }]
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Referral Model
const referralSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  usedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Referral = mongoose.model('Referral', referralSchema);

// Order Model
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  deliveryAddress: {
    houseNo: String,
    area: String,
    city: String
  },
  paymentMethod: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  appliedDiscountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Discount',
    default: null
  },
});

const Order = mongoose.model('Order', orderSchema);

// Review Model
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model('Review', reviewSchema);
// Add this to server-additions.js, with the other models

// Discount Model
const discountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    default: 'percentage'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Discount = mongoose.model('Discount', discountSchema);
// Import User and FoodItem models
const User = mongoose.model('User'); // Assuming User model is defined elsewhere
const FoodItem = mongoose.model('FoodItem'); // Assuming FoodItem model is defined elsewhere
// Add to server-additions.js with other models

// Item Request Model
const itemRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ItemRequest = mongoose.model('ItemRequest', itemRequestSchema);

// ==================== MIDDLEWARE ====================

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, 'super-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

// ==================== ROUTES ====================

// 1. WISHLIST ROUTES
const wishlistRoutes = (app) => {
  // Get user's wishlist
  app.get('/wishlist', authenticateToken, async (req, res) => {
    try {
      let wishlist = await Wishlist.findOne({ userId: req.user.userId }).populate('items');
      
      if (!wishlist) {
        wishlist = { items: [] };
      }
      
      res.status(200).json(wishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ error: 'Error fetching wishlist' });
    }
  });

  // Add item to wishlist
  app.post('/wishlist/add', authenticateToken, async (req, res) => {
    try {
      const { foodItemId } = req.body;
      
      let wishlist = await Wishlist.findOne({ userId: req.user.userId });
      
      if (!wishlist) {
        wishlist = new Wishlist({
          userId: req.user.userId,
          items: [foodItemId]
        });
      } else if (!wishlist.items.includes(foodItemId)) {
        wishlist.items.push(foodItemId);
      }
      
      await wishlist.save();
      res.status(200).json({ message: 'Item added to wishlist', wishlist });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ error: 'Error adding to wishlist' });
    }
  });

  // Remove item from wishlist
  app.delete('/wishlist/remove/:foodItemId', authenticateToken, async (req, res) => {
    try {
      const { foodItemId } = req.params;
      
      const wishlist = await Wishlist.findOne({ userId: req.user.userId });
      
      if (!wishlist) {
        return res.status(404).json({ error: 'Wishlist not found' });
      }
      
      wishlist.items = wishlist.items.filter(item => item.toString() !== foodItemId);
      await wishlist.save();
      
      res.status(200).json({ message: 'Item removed from wishlist', wishlist });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ error: 'Error removing from wishlist' });
    }
  });
};

// 2. REFERRAL ROUTES
const referralRoutes = (app) => {
  // Generate referral code for user
  app.post('/referral/generate', authenticateToken, async (req, res) => {
    try {
      // Check if user already has a referral code
      let referral = await Referral.findOne({ userId: req.user.userId });
      
      if (referral) {
        return res.status(200).json({ code: referral.code });
      }
      
      // Generate a unique referral code
      const generateCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
          code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
      };
      
      let code = generateCode();
      let codeExists = await Referral.findOne({ code });
      
      // Ensure code is unique
      while (codeExists) {
        code = generateCode();
        codeExists = await Referral.findOne({ code });
      }
      
      // Create new referral
      referral = new Referral({
        code,
        userId: req.user.userId,
        usedBy: []
      });
      
      await referral.save();
      res.status(201).json({ code });
    } catch (error) {
      console.error('Error generating referral code:', error);
      res.status(500).json({ error: 'Error generating referral code' });
    }
  });

  // Apply referral code
  // Update the referral/apply endpoint in server-additions.js
app.post('/referral/apply', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    
    // Find the referral code
    const referral = await Referral.findOne({ code });
    
    if (!referral) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }
    
    // Check if user is trying to use their own code
    if (referral.userId.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Cannot use your own referral code' });
    }
    
    // Check if user has already used this code
    if (referral.usedBy.includes(req.user.userId)) {
      return res.status(400).json({ error: 'You have already used this referral code' });
    }
    
    // Add user to usedBy array
    referral.usedBy.push(req.user.userId);
    await referral.save();
    
    // Create discount codes for both users (referrer and referee)
    // For referrer (10% discount)
    const referrerDiscount = new Discount({
      userId: referral.userId,
      code: `REF${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: 10,
      type: 'percentage',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });
    
    // For referee (15% welcome discount)
    const refereeDiscount = new Discount({
      userId: req.user.userId,
      code: `WELCOME${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      amount: 15,
      type: 'percentage',
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
    });
    
    await referrerDiscount.save();
    await refereeDiscount.save();
    
    res.status(200).json({
      message: 'Referral code applied successfully! You have received a 15% discount on your next order.',
      discountCode: refereeDiscount.code
    });
  } catch (error) {
    console.error('Error applying referral code:', error);
    res.status(500).json({ error: 'Error applying referral code' });
  }
});

// Add endpoint to get user's discounts
app.get('/discounts', authenticateToken, async (req, res) => {
  try {
    const discounts = await Discount.find({
      userId: req.user.userId,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    
    res.status(200).json(discounts);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ error: 'Error fetching discounts' });
  }
});

// Add endpoint to apply a discount code to an order
app.post('/discounts/apply', authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    
    const discount = await Discount.findOne({
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    });
    
    if (!discount) {
      return res.status(404).json({ error: 'Invalid or expired discount code' });
    }
    
    // Check if the discount belongs to the user
    if (discount.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'This discount code does not belong to you' });
    }
    
    // Return discount details (will be applied on client side)
    res.status(200).json({
      discount: {
        amount: discount.amount,
        type: discount.type
      }
    });
  } catch (error) {
    console.error('Error applying discount:', error);
    res.status(500).json({ error: 'Error applying discount' });
  }
})
// Add to server-additions.js, in the endpoint section

// Mark a discount as used
app.put('/discounts/:discountId/use', authenticateToken, async (req, res) => {
  try {
    const { discountId } = req.params;
    
    const discount = await Discount.findById(discountId);
    
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    
    // Check if discount belongs to user
    if (discount.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'This discount does not belong to you' });
    }
    
    // Check if discount is already used
    if (discount.isUsed) {
      return res.status(400).json({ error: 'This discount has already been used' });
    }
    
    // Check if discount is expired
    if (new Date() > new Date(discount.expiresAt)) {
      return res.status(400).json({ error: 'This discount has expired' });
    }
    
    // Mark discount as used
    discount.isUsed = true;
    await discount.save();
    
    res.status(200).json({ message: 'Discount successfully applied' });
  } catch (error) {
    console.error('Error using discount:', error);
    res.status(500).json({ error: 'Error using discount' });
  }
});
};
// 3. ORDER HISTORY ROUTES
const orderRoutes = (app) => {
  // Create a new order
  app.post('/orders', authenticateToken, async (req, res) => {
    try {
      const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;
      
      const order = new Order({
        userId: req.user.userId,
        items,
        totalAmount,
        deliveryAddress,
        paymentMethod
      });
      
      await order.save();
      res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Error creating order' });
    }
  });

  // Get user's order history
  app.get('/orders/history', authenticateToken, async (req, res) => {
    try {
      const orders = await Order.find({ userId: req.user.userId })
        .populate('items.foodItem')
        .sort({ createdAt: -1 });
      
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ error: 'Error fetching order history' });
    }
  });

  // Get order details
  app.get('/orders/:orderId', authenticateToken, async (req, res) => {
    try {
      const { orderId } = req.params;
      
      const order = await Order.findById(orderId).populate('items.foodItem');
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Check if the order belongs to the user or if user is admin
      if (order.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Error fetching order details' });
    }
  });

  // Update order status (admin only)
  app.put('/orders/:orderId/status', authenticateToken, isAdmin, async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      order.status = status;
      order.updatedAt = Date.now();
      await order.save();
      
      res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Error updating order status' });
    }
  });
};

// 4. ADMIN DASHBOARD ROUTES
const adminRoutes = (app) => {
  // Get all orders for admin
  app.get('/admin/orders', authenticateToken, isAdmin, async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('userId', 'fullName email')
        .populate('items.foodItem')
        .sort({ createdAt: -1 });
      
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      res.status(500).json({ error: 'Error fetching admin orders' });
    }
  });

  // Get earnings report
  app.get('/admin/earnings', authenticateToken, isAdmin, async (req, res) => {
    try {
      const { period } = req.query; // 'daily', 'weekly', 'monthly', 'yearly'
      
      let startDate;
      const now = new Date();
      
      switch (period) {
        case 'daily':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'weekly':
          startDate = new Date(now.setDate(now.getDate() - now.getDay()));
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'monthly':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'yearly':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.setDate(now.getDate() - 30)); // Default to last 30 days
      }
      
      // Aggregate orders by date and calculate total earnings
      const earningsData = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $ne: 'Cancelled' }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            totalEarnings: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 }
          }
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
      ]);
      
      // Calculate total earnings
      const totalEarnings = earningsData.reduce((sum, day) => sum + day.totalEarnings, 0);
      const totalOrders = earningsData.reduce((sum, day) => sum + day.orderCount, 0);
      
      // Format the data for frontend visualization
      const formattedData = earningsData.map(day => ({
        date: `${day._id.year}-${day._id.month.toString().padStart(2, '0')}-${day._id.day.toString().padStart(2, '0')}`,
        earnings: day.totalEarnings,
        orders: day.orderCount
      }));
      
      res.status(200).json({
        totalEarnings,
        totalOrders,
        data: formattedData
      });
    } catch (error) {
      console.error('Error generating earnings report:', error);
      res.status(500).json({ error: 'Error generating earnings report' });
    }
  });

  // Get performance metrics
  app.get('/admin/performance', authenticateToken, isAdmin, async (req, res) => {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      // Get total users
      const totalUsers = await User.countDocuments();
      
      // Get new users in last 30 days
      const newUsers = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      // Get total orders
      const totalOrders = await Order.countDocuments();
      
      // Get orders in last 30 days
      const recentOrders = await Order.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
      });
      
      // Get average order value
      const avgOrderValue = await Order.aggregate([
        {
          $match: {
            status: { $ne: 'Cancelled' }
          }
        },
        {
          $group: {
            _id: null,
            avgValue: { $avg: '$totalAmount' }
          }
        }
      ]);
      
      // Get most popular food items
      const popularItems = await Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.foodItem',
            count: { $sum: '$items.quantity' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'fooditems',
            localField: '_id',
            foreignField: '_id',
            as: 'foodItem'
          }
        },
        { $unwind: '$foodItem' },
        {
          $project: {
            _id: 1,
            name: '$foodItem.name',
            count: 1
          }
        }
      ]);
      
      res.status(200).json({
        userMetrics: {
          total: totalUsers,
          new: newUsers
        },
        orderMetrics: {
          total: totalOrders,
          recent: recentOrders,
          avgValue: avgOrderValue.length > 0 ? avgOrderValue[0].avgValue : 0
        },
        popularItems
      });
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      res.status(500).json({ error: 'Error fetching performance metrics' });
    }
  });

  // Get all users (admin only)
  app.get('/admin/users', authenticateToken, isAdmin, async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
    }
  });

  // Update user (admin only)
  app.put('/admin/users/:userId', authenticateToken, isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      const { fullName, email, phoneNumber, address, role } = req.body;
      
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Update user fields
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (address) user.address = address;
      if (role) user.role = role;
      
      await user.save();
      
      // Remove password from response
      const userResponse = user.toObject();
      delete userResponse.password;
      
      res.status(200).json({ message: 'User updated successfully', user: userResponse });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
    }
  });

  // Delete user (admin only)
  app.delete('/admin/users/:userId', authenticateToken, isAdmin, async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      await User.findByIdAndDelete(userId);
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error deleting user' });
    }
  });
};

// 5. REVIEW ROUTES
const reviewRoutes = (app) => {
  // Add a review
  app.post('/reviews', authenticateToken, async (req, res) => {
    try {
      const { foodItemId, rating, comment } = req.body;
      
      // Check if user has already reviewed this item
      const existingReview = await Review.findOne({
        userId: req.user.userId,
        foodItemId
      });
      
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this item' });
      }
      
      const review = new Review({
        userId: req.user.userId,
        foodItemId,
        rating,
        comment
      });
      
      await review.save();
      
      // Update food item's average rating
      const allReviews = await Review.find({ foodItemId });
      const avgRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
      
      await FoodItem.findByIdAndUpdate(foodItemId, { rating: avgRating });
      
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ error: 'Error adding review' });
    }
  });

  // Get reviews for a food item
  app.get('/reviews/food/:foodItemId', async (req, res) => {
    try {
      const { foodItemId } = req.params;
      
      const reviews = await Review.find({ foodItemId })
        .populate('userId', 'fullName')
        .sort({ createdAt: -1 });
      
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Error fetching reviews' });
    }
  });

  // Get reviews by a user
  app.get('/reviews/user', authenticateToken, async (req, res) => {
    try {
      const reviews = await Review.find({ userId: req.user.userId })
        .populate('foodItemId')
        .sort({ createdAt: -1 });
      
      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      res.status(500).json({ error: 'Error fetching user reviews' });
    }
  });

  // Update a review
  app.put('/reviews/:reviewId', authenticateToken, async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body;
      
      const review = await Review.findById(reviewId);
      
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      // Check if the review belongs to the user
      if (review.userId.toString() !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      review.rating = rating;
      review.comment = comment;
      await review.save();
      
      // Update food item's average rating
      const allReviews = await Review.find({ foodItemId: review.foodItemId });
      const avgRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
      
      await FoodItem.findByIdAndUpdate(review.foodItemId, { rating: avgRating });
      
      res.status(200).json({ message: 'Review updated successfully', review });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ error: 'Error updating review' });
    }
  });

  // Delete a review
  app.delete('/reviews/:reviewId', authenticateToken, async (req, res) => {
    try {
      const { reviewId } = req.params;
      
      const review = await Review.findById(reviewId);
      
      if (!review) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      // Check if the review belongs to the user or if user is admin
      if (review.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      const foodItemId = review.foodItemId;
      
      await Review.findByIdAndDelete(reviewId);
      
      // Update food item's average rating
      const allReviews = await Review.find({ foodItemId });
      
      if (allReviews.length > 0) {
        const avgRating = allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length;
        await FoodItem.findByIdAndUpdate(foodItemId, { rating: avgRating });
      } else {
        // If no reviews left, set default rating
        await FoodItem.findByIdAndUpdate(foodItemId, { rating: 0 });
      }
      
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ error: 'Error deleting review' });
    }
  });
};


// Create a function for item request routes
const itemRequestRoutes = (app) => {
  // Submit a new item request
  app.post('/item-requests', authenticateToken, async (req, res) => {
    try {
      const { name, description, category } = req.body;
      
      const newRequest = new ItemRequest({
        userId: req.user.userId,
        name,
        description,
        category
      });
      
      await newRequest.save();
      res.status(201).json({ message: 'Item request submitted successfully' });
    } catch (error) {
      console.error('Error submitting item request:', error);
      res.status(500).json({ error: 'Error submitting item request' });
    }
  });

  // Get user's item requests
  app.get('/item-requests/user', authenticateToken, async (req, res) => {
    try {
      const requests = await ItemRequest.find({ userId: req.user.userId })
        .sort({ createdAt: -1 });
      
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching user item requests:', error);
      res.status(500).json({ error: 'Error fetching user item requests' });
    }
  });

  // Admin route to get all item requests
  app.get('/admin/item-requests', authenticateToken, isAdmin, async (req, res) => {
    try {
      const requests = await ItemRequest.find()
        .populate('userId', 'fullName email')
        .sort({ createdAt: -1 });
      
      res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching item requests:', error);
      res.status(500).json({ error: 'Error fetching item requests' });
    }
  });

  // Admin route to update item request status
  app.put('/admin/item-requests/:requestId', authenticateToken, isAdmin, async (req, res) => {
    try {
      const { requestId } = req.params;
      const { status } = req.body;
      
      const request = await ItemRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      );
      
      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }
      
      res.status(200).json(request);
    } catch (error) {
      console.error('Error updating item request:', error);
      res.status(500).json({ error: 'Error updating item request' });
    }
  });
};

// 6. CHATBOT ROUTES
const chatbotRoutes = (app) => {
  // Simple chatbot endpoint
  app.post('/chatbot', authenticateToken, async (req, res) => {
    try {
      const { message } = req.body;
      
      // Simple keyword-based responses
      const lowerMessage = message.toLowerCase();
      let response;
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        response = "Hello! How can I help you today?";
      } else if (lowerMessage.includes('menu') || lowerMessage.includes('food')) {
        response = "You can check our menu on the home page. We have a variety of delicious options!";
      } else if (lowerMessage.includes('order') && lowerMessage.includes('track')) {
        response = "You can track your order in the 'Order History' section of your profile.";
      } else if (lowerMessage.includes('delivery') && lowerMessage.includes('time')) {
        response = "Our typical delivery time is 30-45 minutes depending on your location.";
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
        response = "We accept credit cards, debit cards, and cash on delivery.";
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
        response = "You can reach our customer support at support@tastytracks.com or call us at 123-456-7890.";
      } else {
        response = "I'm not sure how to help with that. Please contact our customer support for assistance.";
      }
      
      res.status(200).json({ response });
    } catch (error) {
      console.error('Error processing chatbot message:', error);
      res.status(500).json({ error: 'Error processing your message' });
    }
  });
};

// Export all route functions
module.exports = {
  wishlistRoutes,
  referralRoutes,
  orderRoutes,
  adminRoutes,
  reviewRoutes,
  chatbotRoutes,
  itemRequestRoutes,
  // Export models for use in other files
  models: {
    Wishlist,
    Referral,
    Order,
    Review,
    Discount,
    ItemRequest,

  }
};

// Example of how to use these routes in your main server.js file:
/*
const express = require('express');
const app = express();
const { 
  wishlistRoutes, 
  referralRoutes, 
  orderRoutes, 
  adminRoutes, 
  reviewRoutes, 
  chatbotRoutes 
} = require('./server-additions');

// Initialize routes
wishlistRoutes(app);
referralRoutes(app);
orderRoutes(app);
adminRoutes(app);
reviewRoutes(app);
chatbotRoutes(app);

// Start server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
*/

// For testing purposes, let's log that the code has been executed
console.log("Backend additions for new features have been defined");

