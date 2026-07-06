const cartService = require("../services/cart.service");

exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItemQuantity(req.user, req.body);

    res.status(200).json({
      message: "تعداد محصول با موفقیت تغییر کرد",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const product = await cartService.addToCart(req.user, req.body);

    res.status(201).json({
      message: "محصول با موفقیت به سبد خرید اضافه شد",
      product,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(req.user, req.params.id);

    res.status(200).json({
      message: "محصول با موفقیت حذف شد",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserCart = async (req, res, next) => {
  try {
    const cart = await cartService.getUserCart(req.user);

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

exports.resetUserCart = async (req, res, next) => {
  try {
    const cart = await cartService.resetUserCart(req.user);

    res.status(200).json({
      message: "سبد خرید با موفقیت خالی شد",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
