const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.config');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const meetingRoutes = require('./routes/Meetings.js');
dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

app.get('/', (req, res) => {
  console.log(req.body);
  res.send('Server is active!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/meeting', meetingRoutes);


// 404 wala error
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});