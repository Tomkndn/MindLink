const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  const URI = 'mongodb://127.0.0.1:27017/MindLink';
  try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
