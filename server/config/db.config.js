const mongoose = require('mongoose');

const connectDB = async () => {
  const URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(URI);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
