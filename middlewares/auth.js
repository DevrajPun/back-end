const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
require("dotenv").config();

const checkUseAuth = async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);

  if (!token) {
    req.flash("error", "Unauthorised user please login");
    return res.redirect("/login");
  }

  try {
    const verifyLogin = jwt.verify(token, process.env.JWT_SECRET);
    const data = await UserModel.findOne({ _id: verifyLogin.ID });
    console.log(data);

    req.data = data;
    next();
  } catch (err) {
    req.flash("error", "Invalid token. Please login again.");
    res.redirect("/login");
  }
};

module.exports = checkUseAuth;
