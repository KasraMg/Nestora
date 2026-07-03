const User = require("../models/user.model");

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

exports.createAddress = async (req, res, next) => {
  try {
    const user = req.user;

    const { postalCode, address, city, province } = req.body;

    user.addresses.push({
      postalCode: postalCode,
      address: address,
      province: {
        provinceName: province.provinceName,
        provinceId: province.provinceId,
      },
      city: {
        cityId: city.cityId,
        cityName: city.cityName,
        provinceId: city.provinceId,
      },
    });

    await user.save();

    res.status(200).json({
      message: "ادرس با موفقیت اضافه شد",
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteAddress = async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  try {
    const address = user.addresses.id(id);

    if (!address) {
      return next(new AppError("آدرس پیدا نشد", 404));
    }

    address.deleteOne();

    await user.save();

    res.status(200).json({
      message: "آدرس با موفقیت حذف شد",
    });
  } catch (error) {
    next(error);
  }
};
