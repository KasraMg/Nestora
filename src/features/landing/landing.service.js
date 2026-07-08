const Banner = require("../banner/banner.model");
const Category = require("../category/category.model");
const Products = require("../product/products.model");
const Article = require("../article/article.model");
const { getCache, setCache } = require("../../services/cache");
const cacheKeys = require("../../utils/constants/cache-keys");

exports.getLandingData = async () => {
  const cachedLanding = await getCache(cacheKeys.LANDING);

  if (cachedLanding) {
    return cachedLanding;
  }


  const [products, articles, categories, banner] = await Promise.all([
    Products.find().sort({ createdAt: -1 }).limit(10),
    Article.find().limit(10),
    Category.find(),
    Banner.find({ position: "home" }),
  ]);

  const landing = {
    products,
    articles,
    categories,
    banner,
  };

  await setCache(cacheKeys.LANDING, landing);

  return landing;
};
