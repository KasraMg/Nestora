const publicService = require("./public.service");

exports.getShopFilters = async (req, res, next) => {
  try {
    const data = await publicService.getShopFilters();

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.getLocations = async (req, res, next) => {
  try {
    const data = await publicService.getLocations();

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};