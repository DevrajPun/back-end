const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures that email addresses are unique
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    con_password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
