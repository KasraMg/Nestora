const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");
const { generateToken } = require("../utils/helpers");

exports.login = async (data) => {
  const { phone, password } = data;

  const user = await User.findOne({ phone }).select("+password");

  if (!user) {
    throw new AppError("کاربری پیدا نشد", 400);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("رمز عبور صحیح نیست", 400);
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,
    },
  };
};

exports.register = async (data) => {
  const { name, phone, password } = data;

  const exists = await User.findOne({ phone });

  if (exists) {
    throw new AppError("حسابی با این شماره قبلاً ثبت شده است", 400);
  }

  const user = new User({
    name,
    phone,
    password,
  });

  await user.save();

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  };
};

exports.changePassword = async (userId, data) => {
  const { currentPassword, newPassword } = data;

  const user = await User.findById(userId).select("+password");

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw new AppError("رمز عبور فعلی اشتباه است", 400);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError("رمز عبور جدید نباید با رمز فعلی یکسان باشد", 400);
  }

  user.password = newPassword;

  await user.save();

  const token = generateToken(user);

  return { token };
};
