const wishlistService = require("./wishlist.service");

exports.getUserWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getUserWishlist(req.user);

    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { product, added } = await wishlistService.toggleWishlist(
      req.user,
      req.params.code
    );

    res.status(added ? 201 : 200).json({
      message: `محصول با موفقیت ${added ? "به" : "از"} علاقه‌مندی‌ها ${
        added ? "اضافه" : "حذف"
      } شد`,
      product,
    });
  } catch (error) {
    next(error);
  }
};