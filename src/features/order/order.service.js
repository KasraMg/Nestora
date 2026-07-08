const crypto = require("crypto");
const Order = require("./order.model");
const AppError = require("../../utils/AppError");

exports.getOrder = async (trackingCode) => {
  if (!trackingCode) {
    throw new AppError("شناسه سفارش ارسال نشده است", 400);
  }

  const order = await Order.findOne({ trackingCode }).populate(
    "products.product",
  );

  if (!order) {
    throw new AppError("سفارشی با این شناسه یافت نشد", 404);
  }

  return order;
};

exports.createOrder = async (user, information) => {
  await user.populate("cart.product");

  if (user.cart.length === 0) {
    throw new AppError("سبد خرید کاربر خالی است", 400);
  }

  const totalPrice = user.cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  const trackingCode = crypto.randomUUID().slice(0, 5);

  const order = new Order({
    totalPrice,
    products: user.cart.map((item) => ({
      product: item.product,
      color: item.color,
      quantity: item.quantity,
      sellPrice: item.product.price,
    })),
    user: user._id,
    information,
    status: "successfull",
    trackingCode,
  });

  await order.save();

  user.cart = [];
  await user.save();

  return {
    trackingCode,
    order,
  };
};