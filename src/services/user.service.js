const Order = require("../models/order.model");
const AppError = require("../utils/AppError");

exports.getMe = async (user) => {
  await user.populate(["cart.product", "wishlist.product"]);

  const orders = await Order.find({
    user: user._id,
  }).populate("products.product");

  const userObj = user.toObject();

  userObj.orders = orders;

  return userObj;
};

exports.editUser = async (user, data) => {
  const { name, phone, email, birthDate, nationalCode } = data;

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (email !== undefined) user.email = email;
  if (birthDate !== undefined) user.birthDate = birthDate;
  if (nationalCode !== undefined) user.nationalCode = nationalCode;

  return await user.save();
};

exports.createAddress = async (user, data) => {
  const { postalCode, address, city, province } = data;

  user.addresses.push({
    postalCode,
    address,
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

  return await user.save();
};

exports.deleteAddress = async (user, id) => {
  const address = user.addresses.id(id);

  if (!address) {
    throw new AppError("آدرس پیدا نشد", 404);
  }

  address.deleteOne();

  await user.save();
};
