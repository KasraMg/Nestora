const bannerService = require("../services/banner.service");

exports.createBanner = async (req, res, next) => {
  try {
    const banner = await bannerService.createBanner(req.body, req.file);

    res.status(201).json({
      message: "بنر با موفقیت ساخته شد",
      banner,
    });
  } catch (error) {
    next(error);
  }
};

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await bannerService.getBanners();

    res.status(200).json({
      message: "لیست بنرها با موفقیت دریافت شد",
      banners,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const deletedBanner = await bannerService.deleteBanner(req.params.id);

    res.status(200).json({
      message: "بنر با موفقیت حذف شد",
      banner: deletedBanner,
    });
  } catch (error) {
    next(error);
  }
};
