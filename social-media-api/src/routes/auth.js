const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { handleError } = require('../utils/errorHandler');

router.post('/register', async (req, res) => {
  try {
    console.log('👤 Registering new user in MongoDB...');
    
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw handleError('All fields are required', 'INVALID_INPUT', 400);
    }
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      throw handleError('User already exists with this email or username', 'USER_EXISTS', 400);
    }
    
    // إنشاء مستخدم جديد (كلمة المرور ستُشفر تلقائياً بواسطة pre-save hook)
    const user = new User({ 
      username, 
      email, 
      password 
    });
    
    const savedUser = await user.save();
    
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log(`✅ User registered successfully: ${savedUser.username}`);
    
    res.json({ 
      token,
      user: {
        id: savedUser._id.toString(),
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    console.error('❌ Registration error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid user data' });
    }
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(err.extensions?.statusCode || 500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('🔐 User login attempt...');
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      throw handleError('Email and password are required', 'INVALID_INPUT', 400);
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      throw handleError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
    }
    
    // التحقق من كلمة المرور
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw handleError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    console.log(`✅ User logged in successfully: ${user.username}`);
    
    res.json({ 
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(err.extensions?.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;