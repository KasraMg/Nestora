const Category = require("../models/category.model");
const AppError = require("../utils/AppError");
const fs = require("fs");
const deleteFile = require("../utils/deleteFile");

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

  return category;
};

exports.getCategories = async () => {
  return await Category.find();
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

  return deletedCategory;
};
