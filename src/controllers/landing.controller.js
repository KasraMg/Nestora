const Banner = require("../models/banner.model");
const Category = require("../models/category.model");
const Products = require("../models/products.model");
const Article = require("../models/article.model");

exports.getLandingData = async (req, res, next) => {
  try {
    const products = await Products.find().sort({ createdAt: -1 }).limit(10);
    const articles = await Article.find().limit(10);
    const categories = await Category.find();
    const banner = await Banner.find({ position: "home" });

    return res.status(200).json({
      products,
      articles,
      categories, 
      banner,
    });
  } catch (error) {
    next(error);
  }
};
