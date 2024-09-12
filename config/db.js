const mongoose = require('mongoose');
require('dotenv').config(); // Memuat variabel lingkungan dari file .env

const connectDB = async () => {
  try {
    // Mengambil URL database dari variabel lingkungan
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
