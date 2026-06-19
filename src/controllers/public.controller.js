const Categories = require("../models/categories.model");
const Products = require("../models/products.model");

exports.getShopFilters = async (req, res, next) => {
  try {
    const categories = await Categories.find();
    const colors = await Products.distinct("colors.name");

    const priceRange = await Products.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    const minPrice = priceRange.length ? priceRange[0].minPrice : 0;
    const maxPrice = priceRange.length ? priceRange[0].maxPrice : 0;

    return res.status(200).json({
      categories,
      colors,
      minPrice,
      maxPrice
    });
  } catch (error) {
    next(error);
  }
};
