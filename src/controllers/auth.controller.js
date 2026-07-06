const authService = require("../services/auth.service");

exports.login = async (req, res, next) => {
  try {
    const { token, user } = await authService.login(req.body);

    res.status(200).json({
      message: "با موفقیت وارد شدید",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { token, user } = await authService.register(req.body);

    res.status(201).json({
      message: "با موفقیت ثبت نام شدید",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { token } = await authService.changePassword(req.user._id, req.body);

    res.status(200).json({
      message: "رمز عبور با موفقیت تغییر کرد",
      token,
    });
  } catch (error) {
    next(error);
  }
};
