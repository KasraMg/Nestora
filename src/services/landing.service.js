const Banner = require("../models/banner.model");
const Category = require("../models/category.model");
const Products = require("../models/products.model");
const Article = require("../models/article.model");

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