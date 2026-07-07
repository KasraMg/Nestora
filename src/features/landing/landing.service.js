const Banner = require("../banner/banner.model");
const Category = require("../category/category.model");
const Products = require("../product/products.model");
const Article = require("../article/article.model");

exports.getLandingData = async () => {
  const [products, articles, categories, banner] = await Promise.all([
    Products.find().sort({ createdAt: -1 }).limit(10),
    Article.find().limit(10),
    Category.find(),
    Banner.find({ position: "home" }),
  ]);

  return {
    products,
    articles,
    categories,
    banner,
  };
};