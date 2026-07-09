const Products = require("./products.model");
const Categories = require("../category/category.model");
const Feedback = require("../feedback/feedback.model");
const User = require("../user/user.model");
const { tokenFormatter } = require("../../utils/helpers");
const AppError = require("../../utils/app-error");
const deleteFile = require("../../utils/delete-file");
const cacheKeys = require("../../utils/constants/cache-keys");
const { deleteCache } = require("../../services/cache");

exports.getProduct = async (code, authorization) => {
  if (!code) {
    throw new AppError("کد محصول ارسال نشده است", 400);
  }

  const cacheKey = `${cacheKeys.PRODUCT}-${code}`;

  let product = await getCache(cacheKey);

  if (product) {
    console.log("🟢 Product served from Redis");
  } else {
    console.log("🟡 Product served from MongoDB");

    product = await Products.findOne({ code: Number(code) })
      .populate("category", "name slug")
      .lean();

    if (!product) {
      throw new AppError("محصول یافت نشد", 404);
    }

    const feedbackStats = await Feedback.aggregate([
      {
        $match: {
          product: product._id,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          totalComments: {
            $sum: {
              $cond: [
                {
                  $ifNull: ["$comment", false],
                },
                1,
                0,
              ],
            },
          },
          totalRatings: {
            $sum: 1,
          },
        },
      },
    ]);

    const stats = feedbackStats[0] || {
      averageRating: 0,
      totalComments: 0,
      totalRatings: 0,
    };

    product.feedback = {
      averageRating: Math.round(stats.averageRating * 10) / 10,
      totalComments: stats.totalComments,
      totalRatings: stats.totalRatings,
    };

    await setCache(cacheKey, product);
  }

  product.isFave = false;
  product.isInCart = false;

  const userId = tokenFormatter(authorization);

  if (!userId) {
    return product;
  }

  const user = await User.findById(userId).select("wishlist cart").lean();

  if (!user) {
    return product;
  }

  if (user.wishlist?.length) {
    product.isFave = user.wishlist.some(
      (item) => item.product?.toString() === product._id.toString(),
    );
  }

  if (user.cart?.length) {
    product.isInCart = user.cart.some(
      (item) => item.product?.toString() === product._id.toString(),
    );
  }

  return product;
};

exports.getProducts = async (query, authorization) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const { category, search, minPrice, maxPrice, sort, color } = query;

  const match = {};

  if (category) {
    const categoryDoc = await Categories.findOne({ slug: category });
    match.category = categoryDoc._id;
  }

  if (search) {
    match.name = { $regex: search.trim(), $options: "i" };
  }
  if (color) {
    match["colors.name"] = color;
  }
  if (minPrice || maxPrice) {
    match.price = {};
    if (minPrice) match.price.$gte = Number(minPrice);
    if (maxPrice) match.price.$lte = Number(maxPrice);
  }

  let sortStage = { createdAt: -1 };

  if (sort) {
    if (sort.startsWith("-")) {
      sortStage = { [sort.substring(1)]: -1 };
    } else {
      sortStage = { [sort]: 1 };
    }
  }

  const result = await Products.aggregate([
    { $match: match },
    {
      $facet: {
        products: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const products = result[0].products;
  const total = result[0].totalCount[0]?.count || 0;

  const userId = tokenFormatter(authorization);
  let userCart = [];

  if (userId) {
    const user = await User.findById(userId).select("cart").lean();
    if (user?.cart?.length > 0) {
      userCart = user.cart.map((item) => item.product?.toString());
    }
  }

  const productsWithCartStatus = products.map((product) => ({
    ...product,
    isInCart: userCart.includes(product._id.toString()),
  }));

  return { page, limit, total, products: productsWithCartStatus };
};

exports.createProduct = async (data, files) => {
  const {
    name,
    price,
    priceWithoutOff,
    star,
    off,
    category,
    code,
    description,
    colors,
    details,
    slug,
  } = data;

  const exists = await Products.findOne({ code });

  if (exists) {
    if (files) {
      await Promise.all(files.map((file) => deleteFile(file.path)));
    }
    throw new AppError("محصولی با این کد قبلاً ثبت شده است", 400);
  }

  const images = files
    ? files.map((file) => {
        return `/uploads/${file.filename}`;
      })
    : [];

  let isCategory = await Categories.findById(category);

  if (!isCategory) {
    throw new AppError("دسته‌بندی با این شناسه یافت نشد", 404);
  }

  const product = new Products({
    name,
    price,
    priceWithoutOff,
    description,
    star,
    off,
    code,
    images,
    category,
    slug,
    colors: colors || [],
    details: details || [],
  });

  await product.save();

  await Promise.all([
    deleteCache(cacheKeys.LANDING),
    deleteCache(cacheKeys.SHOP_FILTERS),
  ]);
  return product;
};

exports.deleteProduct = async (user, code) => {
  if (user.role !== "admin") {
    throw new AppError("کاربر شما دسترسی برای حذف محصول ندارد", 400);
  }
  if (!code) {
    throw new AppError("کد محصول ارسال نشده است", 400);
  }

  const deletedProduct = await Products.findOneAndDelete({
    code: Number(code),
  });

  if (!deletedProduct) {
    throw new AppError("کالایی یافت نشد", 404);
  }
  await Promise.all([
    deleteCache(cacheKeys.LANDING),
    deleteCache(cacheKeys.SHOP_FILTERS),
  ]);
  return deletedProduct;
};
