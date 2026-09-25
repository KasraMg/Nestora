const Category = require("./category.model");
const AppError = require("../../utils/app-error");
const cacheKeys = require("../../utils/constants/cache-keys");
const remember = require("../../services/remember");
const { deleteCache } = require("../../services/cache");
const imagekit = require("../../config/imagekit");

exports.createCategory = async (data, file) => {
  const { name, slug, description, isActive } = data;

  const exists = await Category.findOne({ slug });

  if (exists) {
    throw new AppError("این اسلاگ قبلاً ثبت شده است", 400);
  }

  let image = null;

  if (file) {
    const uploadedImage = await imagekit.upload({
      file: file.buffer,
      fileName: file.originalname,
      folder: "/categories",
    });

    image = uploadedImage.url;
  }

  const category = new Category({
    name,
    slug,
    description,
    image,
    isActive: isActive === "true" || isActive === true,
  });

  await category.save();

  await Promise.all([
    deleteCache(cacheKeys.CATEGORY),
    deleteCache(cacheKeys.LANDING),
    deleteCache(cacheKeys.SHOP_FILTERS),
  ]);

  return category;
};

exports.getCategories = async () => {
  return remember(cacheKeys.CATEGORY, () => Category.find().lean());
};

exports.deleteCategory = async (slug) => {
  if (!slug) {
    throw new AppError("اسلاگ کتگوری ارسال نشده است", 400);
  }

  const deletedCategory = await Category.findOneAndDelete({
    slug,
  });

  if (!deletedCategory) {
    throw new AppError("کتگوری با این اسلاگ یافت نشد", 404);
  }

  await Promise.all([
    deleteCache(cacheKeys.CATEGORY),
    deleteCache(cacheKeys.LANDING),
    deleteCache(cacheKeys.SHOP_FILTERS),
  ]);

  return deletedCategory;
};
