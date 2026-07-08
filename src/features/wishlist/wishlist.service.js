const Products = require("../product/products.model");
const AppError = require("../../utils/app-error");

exports.getUserWishlist = async (user) => {
  await user.populate("wishlist.product");

  return user.wishlist.map((item) => item.product);
};

exports.toggleWishlist = async (user, code) => {
  if (!code) {
    throw new AppError("شناسه‌ای یافت نشد", 400);
  }

  const product = await Products.findOne({ code });

  if (!product) {
    throw new AppError("محصولی با این شناسه یافت نشد", 404);
  }

  const exists = user.wishlist.find(
    (item) => item.product.toString() === product._id.toString(),
  );

  if (exists) {
    user.wishlist = user.wishlist.filter(
      (item) => item.product.toString() !== product._id.toString(),
    );
  } else {
    user.wishlist.push({
      product: product._id,
    });
  }

  await user.save();

  return {
    product,
    added: !exists,
  };
};
