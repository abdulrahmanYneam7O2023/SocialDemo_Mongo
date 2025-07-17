const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { handleError } = require('../utils/errorHandler');
const { mockDB } = require('../utils/mockData');

router.post('/register', async (req, res) => {
  try {
    console.log('📝 Using mock database for register');
    
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      throw handleError('All fields are required', 'INVALID_INPUT', 400);
    }
    
    // التحقق من وجود المستخدم
    const existingUser = mockDB.findUserByEmail(email);
    if (existingUser) {
      throw handleError('User already exists', 'USER_EXISTS', 400);
    }
    
    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // إنشاء مستخدم جديد
    const user = mockDB.createUser({ 
      username, 
      email, 
      password: hashedPassword 
    });
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(err.extensions?.statusCode || 500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    console.log('📝 Using mock database for login');
    
    const { email, password } = req.body;
    
    const user = mockDB.findUserByEmail(email);
    if (!user) {
      throw handleError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
    }
    
    // للتطوير: قبول كلمة مرور بسيطة أو التحقق من الهاش
    const isValidPassword = password === 'password123' || 
                           await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw handleError('Invalid credentials', 'INVALID_CREDENTIALS', 401);
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(err.extensions?.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;