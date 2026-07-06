const orderService = require("../services/order.service");

exports.getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.trackingCode);

    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { trackingCode } = await orderService.createOrder(
      req.user,
      req.body.information,
    );

    res.status(201).json({
      message: "سفارش شما با موفقیت ثبت شد",
      trackingCode,
    });
  } catch (error) {
    next(error);
  }
};
