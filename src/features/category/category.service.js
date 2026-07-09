const Category = require("./category.model");
const AppError = require("../../utils/app-error");
const deleteFile = require("../../utils/delete-file");
const cacheKeys = require("../../utils/constants/cache-keys");
const remember = require("../../services/remember");
const { deleteCache } = require("../../services/cache");

exports.createCategory = async (data, file) => {
  const { name, slug, description, isActive } = data;

  const image = file ? `/uploads/${file.filename}` : null;

  const exists = await Category.findOne({ slug });

  if (exists) {
    if (file) {
      await deleteFile(file?.path);
    }

    throw new AppError("این اسلاگ قبلاً ثبت شده است", 400);
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
