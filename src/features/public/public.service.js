const Province = require("../province/province.model");
const City = require("../city/city.model");
const Category = require("../category/category.model");
const Products = require("../product/products.model");
const cacheKeys = require("../../utils/constants/cache-keys");
const remember = require("../../services/remember");

exports.getShopFilters = async () => {
  return remember(cacheKeys.SHOP_FILTERS, async () => {
    const [categories, colors, priceRange] = await Promise.all([
      Category.find().lean(),
      Products.distinct("colors.name"),
      Products.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
          },
        },
      ]),
    ]);

    return {
      categories,
      colors,
      minPrice: priceRange[0]?.minPrice || 0,
      maxPrice: priceRange[0]?.maxPrice || 0,
    };
  });
};

exports.getLocations = async () => {
  return remember(cacheKeys.LOCATIONS, async () => {
    const [provinces, cities] = await Promise.all([
      Province.find({}, "provinceId provinceName").lean(),
      City.find({}, "cityId cityName provinceId").lean(),
    ]);

    return {
      provinces,
      cities,
    };
  });
};
