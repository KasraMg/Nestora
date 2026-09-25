const Banner = require("./banner.model");
const AppError = require("../../utils/app-error");
const cacheKeys = require("../../utils/constants/cache-keys");
const remember = require("../../services/remember");
const { deleteCache } = require("../../services/cache");
const imagekit = require("../../config/imagekit");

exports.createBanner = async (data, file) => {
  const { position, url, isActive } = data;

  let image = null;

  if (file) {
    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/banners",
    });

    image = uploadedImage.url;
  }

  const banner = new Banner({
    position,
    url,
    image,
    isActive,
  });

  await banner.save();

  await Promise.all([
    deleteCache(cacheKeys.BANNERS),
    deleteCache(cacheKeys.LANDING),
  ]);

  return banner;
};

exports.getBanners = async () => {
  return remember(cacheKeys.BANNERS, () => Banner.find().lean());
};

exports.deleteBanner = async (id) => {
  const deletedBanner = await Banner.findByIdAndDelete(id);

  if (!deletedBanner) {
    throw new AppError("بنری با این شناسه یافت نشد", 404);
  }

  await Promise.all([
    deleteCache(cacheKeys.BANNERS),
    deleteCache(cacheKeys.LANDING),
  ]);

  return deletedBanner;
};
