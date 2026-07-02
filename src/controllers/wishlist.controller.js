const User = require("../models/user.model");
const Products = require("../models/products.model");
const AppError = require("../utils/AppError");

exports.getUserWishlist = async (req, res, next) => {
  try {
    const user = await req.user
      .populate("wishlist.product")

    const wishlist = user.wishlist.map((item) => item.product);
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  const { code } = req.params;
  try {
    const user = req.user;

    if (!code) {
      return next(new AppError("شناسه ای یافت نشد", 404));
    }

    const product = await Products.findOne({ code });
    if (!product) {
      return next(new AppError("محصولی با این شناسه یافت  نشد", 404));
    }
    const alreadyExist = user.wishlist.find(
      (pr) => pr.product.toString() === product._id.toString(),
    );

    if (alreadyExist) {
      user.wishlist = user.wishlist.filter(
        (pr) => pr.product.toString() !== product._id.toString(),
      );
    } else {
      user.wishlist.push({
        product: product._id,
      });
    }

    await user.save();
    res.status(alreadyExist ? 200 : 201).json({
      message: `محصول با موفقیت ${alreadyExist ? "از" : "به"} علاقه مندی ها ${alreadyExist ? "حذف" : "اضافه"} شد`,
      product,
    });
  } catch (error) {
    next(error);
  }
};
