const Banner = require("../models/banner.model");

exports.createBanner = async (req, res) => {
  const { position, url, image, isActive } = req.body;

  try {
    let banner;
    banner = new Banner({
      position,
      url,
      image,
      isActive,
    });
    await banner.save();

    res.status(201).json({
      message: "بنر با موفقیت ساخته شد",

      banner: {
        position: banner.position,
        url: banner.url,
        image: banner.image,
        isActive: banner.isActive,
        id: banner._id,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(201).json({
      message: "لیست بنر ها با موفقیت دریافت شد",
      banners: banners,
    });
  } catch (error) {
    return res.status(500).json({ message: "خطایی غیر منتظره رخ داد" });
  }
};

exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id)
      return res.status(400).json({ message: "ایدی بنر ارسال نشده است" });

    const deletedBanner = await Banner.findByIdAndDelete(id);

    if (!deletedBanner)
      return res.status(404).json({ message: "بنری با این آیدی یافت نشد" });

    return res.status(200).json({
      message: "بنر با موفقیت حذف شد",
      product: deletedBanner,
    });
  } catch (error) {
    return res.status(500).json({ message: "خطایی غیر منتظره رخ داد" });
  }
};
