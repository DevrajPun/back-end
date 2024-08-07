const mongoose = require("mongoose");

const dbCon = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit the process with failure code
  }
};

module.exports = dbCon;
