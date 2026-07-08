const Products = require("../product/products.model");
const AppError = require("../../utils/app-error");

exports.updateCartItemQuantity = async (user, data) => {
  const { id, action } = data;

  if (!id) {
    throw new AppError("شناسه محصول وارد نشده است", 400);
  }

  if (!action) {
    throw new AppError("عملیات مورد نظر وارد نشده است", 400);
  }

  const cartItem = user.cart.find((item) => item._id.toString() === id);

  if (!cartItem) {
    throw new AppError("محصولی با این شناسه در سبد خرید شما یافت نشد", 404);
  }

  if (action === "plus") {
    cartItem.quantity += 1;
  } else if (action === "minus") {
    if (cartItem.quantity <= 1) {
      throw new AppError("تعداد محصول نمی‌تواند کمتر از ۱ باشد", 400);
    }

    cartItem.quantity -= 1;
  } else {
    throw new AppError("عملیات وارد شده معتبر نیست", 400);
  }

  await user.save();

  return user.cart;
};

exports.addToCart = async (user, data) => {
  const { code, color } = data;

  if (!code) {
    throw new AppError("کد محصول وارد نشده است", 400);
  }

  if (!color) {
    throw new AppError("رنگ محصول وارد نشده است", 400);
  }

  const product = await Products.findOne({ code });

  if (!product) {
    throw new AppError("محصولی با این کد یافت نشد", 404);
  }

  const exists = user.cart.find(
    (item) => item.product.toString() === product._id.toString(),
  );

  if (exists) {
    exists.quantity += 1;
  } else {
    user.cart.push({
      product: product._id,
      quantity: 1,
      color,
    });
  }

  await user.save();

  return {
    product: product._id,
    quantity: exists ? exists.quantity : 1,
    color,
  };
};

exports.removeFromCart = async (user, id) => {
  if (!id) {
    throw new AppError("شناسه محصول وارد نشده است", 400);
  }

  const exists = user.cart.find((item) => item._id.toString() === id);

  if (!exists) {
    throw new AppError("محصولی با این شناسه در سبد خرید شما یافت نشد", 404);
  }

  user.cart = user.cart.filter((item) => item._id.toString() !== id);

  await user.save();

  return user.cart;
};

exports.getUserCart = async (user) => {
  await user.populate("cart.product");

  let totalPrice = 0;
  let totalItems = 0;

  const items = user.cart
    .map((item) => {
      if (!item.product) return null;

      const itemPrice = item.product.price * item.quantity;

      totalPrice += itemPrice;
      totalItems += item.quantity;

      return {
        product: item.product,
        quantity: item.quantity,
        itemPrice,
      };
    })
    .filter(Boolean);

  return {
    items,
    totalItems,
    totalPrice,
  };
};

exports.resetUserCart = async (user) => {
  user.cart = [];

  await user.save();

  return user.cart;
};
