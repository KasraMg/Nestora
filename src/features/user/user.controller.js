const userService = require("./user.service");

exports.getMe = async (req, res, next) => {
  try {
    const user = await userService.getMe(req.user);

    res.json({
      ...user,
    });
  } catch (error) {
    next(error);
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const user = await userService.getUsers();

    res.json({
      ...user,
    });
  } catch (error) {
    next(error);
  }
};
exports.changeUserRole = async (req, res, next) => {
  try {
    const phone = req.params.phone;
    const newRole = await userService.changeUserRole(phone);

    res.json({
      message: `role updated to ${newRole} successfully`,
    });
  } catch (error) {
    next(error);
  }
};

exports.editUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.editUser(req.user, req.body);

    res.status(200).json({
      message: "ویرایش با موفقیت انجام شد",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.createAddress = async (req, res, next) => {
  try {
    const updatedUser = await userService.createAddress(req.user, req.body);

    res.status(200).json({
      message: "ادرس با موفقیت اضافه شد",
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  const { id } = req.params;
  try {
    await userService.deleteAddress(req.user, id);

    res.status(200).json({
      message: "آدرس با موفقیت حذف شد",
    });
  } catch (error) {
    next(error);
  }
};
