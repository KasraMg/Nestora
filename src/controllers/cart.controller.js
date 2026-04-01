const User = require("../models/user.model");
const Products = require("../models/products.model");

exports.addToCart = async (req, res, next) => {
  try {
    const { code } = req.params;

    const user = await User.findById(req.user.id).select("-password");
    const product = await Products.findOne({ code });

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    } else if (!code) {
      return res.status(404).json({ message: "کد محصول وارد نشده است " });
    } else if (!product) {
      return res.status(404).json({ message: "محصولی با این کد یافت نشد" });
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
      });
    }
    await user.save();

    res.status(201).json({
      message: "محصول با موفقیت به سبد خرید شما اضافه شد",
      cart: user.cart,
    });
  } catch (error) {
    next(error);
  }
};
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    } else if (!productId) {
      return res.status(400).json({ message: "شناسه محصول ارسال نشده است" });
    }

    const exitProduct = user.cart.find(
      (pr) => pr.product.toString() === productId.toString(),
    );
    if (exitProduct) {
      user.cart = user.cart.filter(
        (pr) => pr.product.toString() !== productId.toString(),
      );
    } else {
      return res
        .status(400)
        .json({ message: "محصولی با این کد در سبد شما یافت نشد" });
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
 