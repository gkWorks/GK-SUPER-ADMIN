const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
// MongoDB Connection Function
const connectDB = async (url) => {
  try {
    // Optional: Set global options for mongoose
    mongoose.set('strictQuery', true);

    // Connect to MongoDB
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
