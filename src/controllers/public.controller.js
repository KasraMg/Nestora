const Category = require("../models/category.model");
const Products = require("../models/products.model");
const Province = require("../models/province.model");
const City = require("../models/city.model");

exports.getShopFilters = async (req, res, next) => {
  try {
    const categories = await Category.find();
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
      maxPrice,
    });
  } catch (error) {
    next(error);
  }
};

let cache = null;

exports.getLocations = async (req, res) => {
  if (cache) {
    return res.json(cache);
  }
  const [provinces, cities] = await Promise.all([
    Province.find({}, "provinceId provinceName").lean(),
    City.find({}, "cityId cityName provinceId").lean(),
  ]);

  cache = { provinces, cities };

  res.json({
    provinces,
    cities,
  });
};
