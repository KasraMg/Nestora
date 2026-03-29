const Categories = require("../models/categories.model");

exports.createCategory = async (req, res) => {
  const { name, slug, image, isActive } = req.body;

  try {
    let category = await Categories.findOne({ slug });
    if (category)
      return res.status(400).json({ message: "این اسلاگ قبلا اضافه شده است" });

    category = new Categories({
      name,
      slug,
      image,
      isActive,
    });
    await category.save();

    res.status(201).json({
      message: "کتگوری با موفقیت ساخته شد",
      category: {
        name: category.name,
        slug: category.slug,
        image: category.image,
        isActive: category.isActive,
        id: category.id,
      },
    });
  } catch (error) {}
  next(error);
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Categories.find();
    if (!categories) {
      return res.status(404).json({ message: "کتگوری" });
    }
    res.status(200).json(categories);
  } catch (error) {
    next(error);
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
    next(error);
  }
};
