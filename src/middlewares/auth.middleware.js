const jwt = require("jsonwebtoken");
const User = require("../features/user/user.model");
const AppError = require("../utils/AppError");
const env = require("./src/config/env");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("فرمت توکن وارد شده اشتباه است", 401));
    }

    const token = authHeader.split(" ")[1];

    const { id } = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(id)

    if (!user) {
      return next(new AppError("کاربری یافت نشد", 404));
    }

    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
