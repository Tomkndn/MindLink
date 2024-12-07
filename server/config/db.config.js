const mongoose = require('mongoose');

const connectDB = async () => {
  const URI = 'mongodb://localhost:27017/MindLink';
  try {
    await mongoose.connect(URI);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
