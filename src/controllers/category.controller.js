const categoryService = require("../services/category.service");

exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoryService.createCategory(
      req.body,
      req.file
    );

    res.status(201).json({
      message: "کتگوری با موفقیت ساخته شد",
      category,
    });
  } catch (error) {
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories();

    res.status(200).json({
      message: "لیست کتگوری‌ها با موفقیت دریافت شد",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await categoryService.deleteCategory(req.params.slug);

    res.status(200).json({
      message: "کتگوری با موفقیت حذف شد",
      category,
    });
  } catch (error) {
    next(error);
  }
};