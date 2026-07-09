const Banner = require("../banner/banner.model");
const Category = require("../category/category.model");
const Products = require("../product/products.model");
const Article = require("../article/article.model");
const cacheKeys = require("../../utils/constants/cache-keys");
const remember = require("../../services/remember");

exports.getLandingData = async () => {
  return remember(cacheKeys.LANDING, async () => {
    const [products, articles, categories, banner] = await Promise.all([
      Products.find().sort({ createdAt: -1 }).limit(10).lean(),
      Article.find().limit(10).lean(),
      Category.find().lean(),
      Banner.find({ position: "home" }).lean(),
    ]);

    return {
      products,
      articles,
      categories,
      banner,
    };
  });
};
