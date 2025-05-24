require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const User = require('./models/user.model');

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://greencart-frontend.onrender.com', 'http://localhost:5173']
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// MongoDB Connection with better error handling
console.log('Attempting to connect to MongoDB...');
console.log('Environment:', process.env.NODE_ENV || 'development');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(async () => {
  console.log('Successfully connected to MongoDB.');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Host:', mongoose.connection.host);
  
  // Test database connection by checking for existing users
  try {
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} existing users in the database`);
    
    if (userCount === 0) {
      // Create admin user if no users exist
      const adminUser = new User({
        email: 'isa@example.com',
        password: '12345678',
        name: 'Admin User',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error checking/creating admin user:', error);
  }
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

// Test route to check database
app.get('/api/test-db', async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      message: 'Database connection successful',
      userCount: users.length,
      users: users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }))
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      error: 'Database test failed',
      details: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  }[dbState];

  res.json({ 
    status: 'Server is running',
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      name: mongoose.connection.db?.databaseName,
      host: mongoose.connection.host
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../Frontend/client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
  console.log(`Database test available at: http://localhost:${PORT}/api/test-db`);
});