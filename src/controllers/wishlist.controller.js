const User = require("../models/user.model");
const Products = require("../models/products.model");

exports.getUserWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("wishlist.product")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }
    const wishlist = user.wishlist.map((item) => item.product); 
    res.status(200).json(wishlist);
  } catch (error) {
    next(error);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  const { code } = req.params;
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "کاربری یافت نشد" });
    }
    if (!code) {
      return res.status(404).json({ message: "کد محصول ارسال نشده است " });
    }

    const product = await Products.findOne({ code });
    if (!product) {
      return res.status(404).json({ message: "محصولی با این شناسه یافت  نشد" });
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
