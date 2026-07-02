const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getMe = async (req, res, next) => {
  try {
    const user = await req.user.populate(["cart.product", "wishlist.product"]);
    res.json({
      ...user.toObject(),
      impersonatedBy: req.user.impersonatedBy || null,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
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
      message: "با موفقیت وارد شدید",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const { name, phone, password } = req.body;
  try {
    let user = await User.findOne({ phone });
    if (user)
      return res
        .status(400)
        .json({ message: "حسابی با این شماره قبلا ثبت شده است" });

    user = new User({ name, phone, password });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      token,
      message: "با موفقیت ثبت نام شدید",
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.impersonateUser = async (req, res, next) => {
  const targetUser = req.user;

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

exports.editUser = async (req, res, next) => {
  try {
    const user = req.user;

    const { name, phone, email, birthDate, nationalCode } = req.body;

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (email !== undefined) user.email = email;
    if (birthDate !== undefined) user.birthDate = birthDate;
    if (nationalCode !== undefined) user.nationalCode = nationalCode;

    await user.save();

    res.status(200).json({
      message: "ویرایش با موفقیت انجام شد",
      user,
    });
  } catch (error) {
    next(error);
  }
};
