const isLogin = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    return res.redirect("/home");
  }
  next();
};

module.exports = isLogin;
