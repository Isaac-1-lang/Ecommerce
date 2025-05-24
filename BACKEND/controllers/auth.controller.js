const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Session = require('../models/session.model');

const SECRET_KEY = process.env.JWT_SECRET || "361304olc0012024";
const SESSION_DURATION = 1 * 60 * 1000; // 10 minutes in milliseconds

exports.login = async (req, res) => {
  try {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;
    
    // Debug: List all users in database
    const allUsers = await User.find({});
    console.log('All users in database:', allUsers.map(u => ({ email: u.email, id: u._id })));
    
    const user = await User.findOne({ email });
    console.log('Found user:', user ? { email: user.email, id: user._id } : 'Not found');
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid Email or password' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Delete any existing sessions for this user
    await Session.deleteMany({ userId: user._id });

    // Create new session
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '10m' }
    );

    const session = new Session({
      userId: user._id,
      token,
      expiresAt: new Date(Date.now() + SESSION_DURATION)
    });

    await session.save();

    console.log('Login successful for:', email);
    res.json({ 
      token, 
      role: user.role,
      expiresIn: SESSION_DURATION,
      expiresAt: session.expiresAt
    });
    console.log("User logged in is: " + user.role);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error during login' });
  }
};

exports.register = async (req, res) => {
  try {
    console.log('=== Registration Process Start ===');
    console.log('Received registration request:', req.body);
    const { email, password, name, role } = req.body;

    // Debug: List all users before registration
    const usersBefore = await User.find({});
    console.log('Users before registration:', usersBefore.map(u => ({ 
      email: u.email, 
      id: u._id,
      name: u.name,
      role: u.role 
    })));

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    console.log('Creating new user with data:', {
      email,
      name,
      role: role || 'customer',
      passwordLength: password.length
    });

    // Create new user
    const user = new User({
      email,
      password,
      name,
      role: role || 'customer'
    });

    console.log('Saving user to database...');
    const savedUser = await user.save();
    console.log('User saved successfully:', {
      id: savedUser._id,
      email: savedUser.email,
      name: savedUser.name,
      role: savedUser.role,
      createdAt: savedUser.createdAt
    });

    // Debug: List all users after registration
    const usersAfter = await User.find({});
    console.log('Users after registration:', usersAfter.map(u => ({ 
      email: u.email, 
      id: u._id,
      name: u.name,
      role: u.role 
    })));

    // Create session for new user
    const token = jwt.sign(
      { id: savedUser._id, email: savedUser.email, role: savedUser.role },
      SECRET_KEY,
      { expiresIn: '10m' }
    );

    console.log('Creating session...');
    const session = new Session({
      userId: savedUser._id,
      token,
      expiresAt: new Date(Date.now() + SESSION_DURATION)
    });

    await session.save();
    console.log('Session created successfully');
    console.log('=== Registration Process Complete ===');

    res.status(201).json({ 
      token, 
      role: savedUser.role,
      expiresIn: SESSION_DURATION,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    console.error('=== Registration Error ===');
    console.error('Error details:', error);
    if (error.name === 'ValidationError') {
      console.error('Validation error details:', error.errors);
      return res.status(400).json({ 
        error: 'Validation error', 
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ error: 'Error during registration' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      await Session.deleteOne({ token });
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Error during logout' });
  }
};

exports.refreshSession = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Check if session is about to expire (less than 2 minutes remaining)
    const timeLeft = session.expiresAt - Date.now();
    if (timeLeft > 2 * 60 * 1000) {
      return res.json({ 
        message: 'Session still valid',
        expiresIn: timeLeft,
        expiresAt: session.expiresAt
      });
    }

    // Create new session
    const user = await User.findById(session.userId);
    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: '10m' }
    );

    // Update session
    session.token = newToken;
    session.expiresAt = new Date(Date.now() + SESSION_DURATION);
    await session.save();

    res.json({ 
      token: newToken,
      expiresIn: SESSION_DURATION,
      expiresAt: session.expiresAt
    });
  } catch (error) {
    console.error('Session refresh error:', error);
    res.status(500).json({ error: 'Error refreshing session' });
  }
}; 