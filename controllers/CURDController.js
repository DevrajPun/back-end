const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class CURDController {
  static test = async (req, res) => {
    try {
      res.send("hello");
    } catch (error) {
      console.log(error);
    }
  };
  static insertUser = async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        con_password: confirmPassword,
      } = req.body;

      // Validate input fields
      if (!name || !email || !phone || !password || !confirmPassword) {
        return res
          .status(400)
          .json({ status: "failed", message: "All fields are required" });
      }

      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ status: "failed", message: "Passwords do not match" });
      }

      // Check if email already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ status: "failed", message: "Email already exists" });
      }

      // Hash password and create new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        name,
        email,
        phone,
        password: hashedPassword,
        con_password: hashedPassword, // Ensure consistency or remove if not needed
      });

      // Save user to database
      await newUser.save();

      // Generate JWT token
      const token = jwt.sign({ ID: newUser._id }, process.env.JWT_SECRET);
      res.cookie("token", token);

      // Return success response
      res.status(201).json({
        status: "success",
        message: "Registration successful! Please log in.",
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({
        status: "failed",
        message: "Server error. Please try again later.",
      });
    }
  };
  static veryLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input fields
      if (!email || !password) {
        return res.status(400).json({
          status: "failed",
          message: "Email and password are required",
        });
      }

      // Find user by email
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res
          .status(404)
          .json({ status: "failed", message: "User not found" });
      }

      // Compare password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ status: "failed", message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { ID: user._id },
        process.env.JWT_SECRET || "default_secret"
      );
      res.cookie("token", token);

      // Redirect based on user role
      if (user.role === "user") {
        return res.status(200).json({
          status: "success",
          message: "Login successful",
          redirect: "/home",
        });
      } else if (user.role === "admin") {
        return res.status(200).json({
          status: "success",
          message: "Login successful",
          redirect: "/admin/dashboard",
        });
      } else {
        return res
          .status(400)
          .json({ status: "failed", message: "Unknown user role" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({
        status: "failed",
        message: "Server error. Please try again later.",
      });
    }
  };
  static getAll = async (req, res) => {
    try {
      const data = await UserModel.find();
      res.status(200).json({
        data,
      });
    } catch (error) {
      res.send(error);
    }
  };
  static getOne = async (req, res) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ status: "failed", message: error.message });
    }
  };
  static logout = async (req, res) => {
    try {
      // Clear the authentication token from the cookies
      res.clearCookie("token");

      // Send a JSON response indicating successful logout
      res
        .status(200)
        .json({ status: "success", message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during logout:", error);
      // Send a JSON response indicating an error occurred
      res.status(500).json({
        status: "failed",
        message: "Server error. Please try again later.",
      });
    }
  };
}
module.exports = CURDController;
