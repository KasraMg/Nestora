const User = require("../models/user.model");
const Products = require("../models/products.model");
const AppError = require("../utils/AppError");

exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const { id, action } = req.body;

    const user = req.user;
    const product = user.cart.find((item) => item._id == id);

    if (!id) {
      return next(new AppError("شناسه محصول وارد نشده است ", 404));
    }
    if (!action) {
      return next(new AppError(" عملیات مورد نظر وارد نشده است ", 400));
    }
    if (!product) {
      return next(
        new AppError("محصولی با این شناسه در سبد خرید شما یافت نشد", 404),
      );
    }

    if (action == "plus") {
      product.quantity += 1;
    } else if (action == "minus") {
      if (product.quantity <= 1) {
        return next(new AppError("تعداد محصول نمی‌تواند کمتر از ۱ باشد", 400));
      }
      product.quantity -= 1;
    } else {
      return next(new AppError(" عملیات وارد شده معتبر نیست نیست ", 400));
    }

    await user.save();

    res.status(201).json({
      message: `تعداد محصول با موفقیت ${action == "plus" ? "اضافه" : "کم"} شد`,
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};
exports.addToCart = async (req, res, next) => {
  try {
    const { code, color } = req.body;

    const user = req.user;
    const product = await Products.findOne({ code });

    if (!code) {
      return next(new AppError("کد محصول وارد نشده است", 404));
    }
    if (!color) {
      return next(new AppError("رنگ محصول وارد نشده است", 404));
    }
    if (!product) {
      return next(new AppError("محصولی با این کد یافت نشد", 404));
    }

    const exitProduct = user.cart.find(
      (pr) => pr.product.toString() === product._id.toString(),
    );

    if (exitProduct) {
      exitProduct.quantity += 1;
    } else {
      user.cart.push({
        product: product._id,
        quantity: 1,
        color: color,
      });
    }

    await user.save();

    res.status(201).json({
      message: "محصول با موفقیت به سبد خرید شما اضافه شد",
      product: {
        product: product._id,
        quantity: 1,
        color: color,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;

    if (!id) {
      return next(new AppError("شناسه محصول وارد نشده است ", 400));
    }

    const exitProduct = user.cart.find(
      (pr) => pr._id.toString() === id.toString(),
    );
    if (exitProduct) {
      user.cart = user.cart.filter((pr) => pr._id.toString() !== id.toString());
    } else {
      return next(
        new AppError("محصولی با این شناسه در سبد خرید شما یافت نشد", 404),
      );
    }
    await user.save();

    res.status(200).json({
      message: "محصول با موفقیت از سبد خرید شما حذف شد",
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};
exports.getUserCart = async (req, res, next) => {
  try {
    const user = req.user.populate("cart.product")

    let totalPrice = 0;
    let totalItems = 0;

    const cartDetails = user.cart
      .map((item) => {
        if (!item.product) {
          return null;
        }

        const itemPrice = item.product.price * item.quantity;
        totalPrice += itemPrice;
        totalItems += item.quantity;

        return {
          product: item.product,
          quantity: item.quantity,
          itemPrice: itemPrice,
        };
      })
      .filter((item) => item !== null);

    res.status(200).json({
      items: cartDetails,
      totalItems: totalItems,
      totalPrice: totalPrice,
    });
  } catch (error) {
    next(error);
  }
};
exports.resetUserCart = async (req, res, next) => {
  try {
    const user = req.user;
  
    user.cart = [];
    await user.save();

    res.status(200).json({
      message: "محصول با موفقیت از سبد خرید شما حذف شد",
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};
