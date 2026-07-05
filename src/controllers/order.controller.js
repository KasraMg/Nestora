const Order = require("../models/order.model");
const AppError = require("../utils/AppError");

exports.getOrder = async (req, res, next) => {
  const { trackingCode } = req.params;
  try {
    if (!trackingCode) {
      return next(new AppError("شناسه سفارش ارسال نشده است", 400));
    }
    const order = await Order.findOne({ trackingCode }).populate(
      "products.product",
    );
    if (order) {
      res.status(200).json(order);
    } else {
      return next(new AppError("سفارشی با این شناسه یافت نشد", 404));
    }
  } catch (error) {
    next(error);
  }
};
exports.createOrder = async (req, res, next) => {
  const user = await req.user.populate("cart.product");
  const { information } = req.body;
  try {
    if (user.cart.length == 0) {
      return next(new AppError("سبد خرید کاربر خالی است", 400));
    }
    const prices = user.cart.map((item) => item.quantity * item.product.price);
    const totalPrice = prices?.reduce((a, b) => a + b, 0);

    const trackingCode = crypto.randomUUID().slice(0, 5);
    const order = new Order({
      totalPrice,
      products: user.cart.map((item) => {
        return {
          product: item.product,
          color: item.color,
          quantity: item.quantity,
          sellPrice: item.product.price,
        };
      }),
      user: user._id,
      information,
      status: "successfull",
      trackingCode,
    });

    await order.save();
    user.cart = [];
    await user.save();

    res.status(201).json({
      message: `سفارش شما با موفقیت ثبت شد`,
      trackingCode,
    });
  } catch (error) {
    next(error);
  }
};
