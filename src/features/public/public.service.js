const Province = require("../province/province.model");
const City = require("../city/city.model");
const Category = require("../category/category.model");
const Products = require("../product/products.model");

let locationsCache = null;

exports.getShopFilters = async () => {
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

  return {
    categories,
    colors,
    minPrice: priceRange[0]?.minPrice || 0,
    maxPrice: priceRange[0]?.maxPrice || 0,
  };
};

exports.getLocations = async () => {
  if (locationsCache) {
    return locationsCache;
  }

  const [provinces, cities] = await Promise.all([
    Province.find({}, "provinceId provinceName").lean(),
    City.find({}, "cityId cityName provinceId").lean(),
  ]);

  locationsCache = {
    provinces,
    cities,
  };

  return locationsCache;
};
