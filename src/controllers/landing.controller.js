const Banner = require("../models/banner.model");
const Categories = require("../models/categories.model");
const Products = require("../models/products.model");
const Articles = require("../models/articles.model");

exports.getLandingData = async (req, res) => {
  try {
    const products = await Products.find().sort({ createdAt: -1 }).limit(5);
    const articles = await Articles.find();
    const categories = await Categories.find();
    const banner = await Banner.find({ position: "Home" });

    return res.status(200).json({
      products,
      articles,
      categories, 
      banner,
    });
  } catch (error) {
    return res.status(500).json({ message: "خطای سرور" });
  }
};
