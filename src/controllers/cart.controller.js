const User = require("../models/user.model");
const Products = require("../models/products.model");

exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const { id, action } = req.body;

    const user = await User.findById(req.user.id).select("-password");
    const product = user.cart.find((item) => item._id == id);

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }
    if (!id) {
      return res.status(404).json({ message: "شناسه محصول وارد نشده است " });
    }
    if (!action) {
      return res
        .status(404)
        .json({ message: " عملیات مورد نظر وارد نشده است " });
    }
    if (!product) {
      return res
        .status(404)
        .json({ message: "محصولی با این شناسه در سبد خرید شما یافت نشد" });
    }

    if (action == "plus") {
      product.quantity += 1;
    } else if (action == "minus") {
      if (product.quantity <= 1) {
        return res
          .status(400)
          .json({ message: "تعداد محصول نمی‌تواند کمتر از ۱ باشد" });
      }
      product.quantity -= 1;
    } else {
      return res.status(404).json({ message: "عملیات وارد شده معتبر نیست" });
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

    const user = await User.findById(req.user.id).select("-password");
    const product = await Products.findOne({ code });

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }
    if (!code) {
      return res.status(404).json({ message: "کد محصول وارد نشده است " });
    }
    if (!color) {
      return res.status(404).json({ message: " رنگ محصول وارد نشده است " });
    }
    if (!product) {
      return res.status(404).json({ message: "محصولی با این کد یافت نشد" });
    }

    const exitProduct = user.cart.find(
      (pr) => pr.product.toString() === product._id.toString(),
    );
    console.log(color);

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

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    } else if (!id) {
      return res.status(400).json({ message: "شناسه محصول ارسال نشده است" });
    }

    const exitProduct = user.cart.find(
      (pr) => pr._id.toString() === id.toString(),
    );
    if (exitProduct) {
      user.cart = user.cart.filter((pr) => pr._id.toString() !== id.toString());
    } else {
      return res
        .status(400)
        .json({ message: "محصولی با این شناسه در سبد شما یافت نشد" });
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
    const user = await User.findById(req.user.id)
      .populate("cart.product")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }

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
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }

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
