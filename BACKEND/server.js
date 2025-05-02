const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); 

const SECRET_KEY = "361304olc0012024";
const PORT = 5000;

// Mock user database (replace with a real database like MongoDB)
const users = [
  { id: 1, email: 'isaprecieux112@gmail.com', password: bcrypt.hashSync('361304olc0012024', 10), role: 'admin' },
  { id: 2, email: 'byiringiroAloys@outlook.com', password: bcrypt.hashSync('121402pr0732021', 10), role: 'customer' },
  { id: 3, email: 'paola@outlook.com', password: bcrypt.hashSync('121402pr0732021', 10), role: 'admin' },
  { id: 4, email: 'shoula@outlook.com', password: bcrypt.hashSync('121402pr0732021', 10), role: 'customer' },
  { id: 5, email: 'christella@outlook.com', password: bcrypt.hashSync('121402pr0732021', 10), role: 'admin' },
  { id: 6, email: 'berard@outlook.com', password: bcrypt.hashSync('121402pr0732021', 10), role: 'customer' },
  { id: 7, email: 'angelo@outlook.com', password: bcrypt.hashSync('121402pr0732021', 10), role: 'admin' },
  { id: 8, email: 'edward250@outlook.com', password: bcrypt.hashSync('121402pr0732021', 10), role: 'customer' },
];

// Login endpoint with debugging
app.post('/api/login', (req, res) => {
  console.log('Received login request:', req.body);
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);

  if (!user) {
    console.log('User not found:', email);
    return res.status(401).json({ error: 'Invalid Email or password' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    console.log('Password mismatch for:', email);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log('Login successful for:', email);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token, role: user.role });
  console.log("User logged in is: "+user.role);
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));