const Banner = require("../models/banner.model");
const AppError = require("../utils/AppError");

exports.createBanner = async (data, file) => {
  const { position, url, isActive } = data;

  const image = file ? `/uploads/${file.filename}` : null;

  const banner = new Banner({
    position,
    url,
    image,
    isActive,
  });

  await banner.save();

  return banner;
};

exports.getBanners = async () => {
  return await Banner.find();
};

exports.deleteBanner = async (id) => {
  const deletedBanner = await Banner.findByIdAndDelete(id);

  if (!deletedBanner) {
    throw new AppError("بنری با این شناسه یافت نشد", 404);
  }

  return deletedBanner;
};