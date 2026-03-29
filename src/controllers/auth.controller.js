const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }
    res.json({
      ...user.toObject(),
      impersonatedBy: req.user.impersonatedBy || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "کاربری پیدا نشد" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "رمز عبور صحیح نیست" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res) => {
  const { name, phone, email, password } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = new User({ name, phone, email, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(" ") });
    }
  }
};

exports.impersonateUser = async (req, res) => {
  const targetUser = await User.findById(req.params.userId);

  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign(
    {
      id: targetUser._id,
      role: targetUser.role,
      impersonatedBy: req.user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  res.json({
    token,
    impersonatedUser: {
      id: targetUser._id,
      name: targetUser.name,
      phone: targetUser.phone,
    },
  });
};
