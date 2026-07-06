const Category = require("../models/category.model");
const AppError = require("../utils/AppError");
const fs = require('fs');

exports.createCategory = async (req, res, next) => {
  const { name, slug, description, isActive } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let category = await Category.findOne({ slug });
    if (category) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => console.log(err));
      }
    }
    category = new Category({
      name,
      slug,
      description,
      image,
      isActive: isActive === "true" || isActive === true,
    });

    await category.save();

    res.status(201).json({
      message: "کتگوری با موفقیت ساخته شد",
      category: {
        name: category.name,
        slug: category.slug,
        image: category.image,
        description: category.description,
        isActive: category.isActive,
        id: category._id,
      },
    });
  } catch (error) { 
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return next(new AppError("شناسه کتگوری ارسال نشده است", 400));
    }

    const deletedCategory = await Category.findOneAndDelete({
      slug,
    });

    if (!deletedCategory) {
      return next(new AppError("کتگوری با این شناسه یافت نشد ", 400));
    }

    return res.status(200).json({
      message: "کتگوری با موفقیت حذف شد",
      category: deletedCategory,
    });
  } catch (error) {
    next(error);
  }
};
