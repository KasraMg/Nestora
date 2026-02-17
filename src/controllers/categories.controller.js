const Categories = require("../models/categories.model");

exports.createCategory = async (req, res) => {
  const { name, slug, isActive } = req.body;

  try {
    let category = await Categories.findOne({ slug });
    if (category)
      return res.status(400).json({ message: "این اسلاگ قبلا اضافه شده است" });

    category = new Categories({
      name,
      slug,
      isActive,
    });
    await category.save();

    res.status(201).json({
      message: "کتگوری با موفقیت ساخته شد",
      category: {
        name: category.name,
        slug: category.slug,
        isActive: category.isActive,
        id: category.id,
      },
    });
  } catch (error) {}
  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0].message;
    return res.status(400).json({ message: firstError });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    if (!categories) {
      return res.status(404).json({ message: "کتگوری" });
    }
    res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: "خطایی غیر منتظره رخ داد" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "اسلاگ کتگوری ارسال نشده است" });
    }

    const deletedCategory = await Categories.findOneAndDelete({
      slug,
    });

    if (!deletedCategory) {
      return res.status(404).json({ message: "کتگوری یافت نشد" });
    }

    return res.status(200).json({
      message: "کتگوری با موفقیت حذف شد",
      category: deletedCategory,
    });
  } catch (error) {
    return res.status(500).json({ message: "خطایی غیر منتظره رخ داد" });
  }
};
