const Categories = require("../models/categories.model");

exports.createCategory = async (req, res, next) => {
  const { name, slug, description, isActive } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let category = await Categories.findOne({ slug });
    if (category) {
      if (req.file) {
        fs.unlink(req.file.path, (err) => console.log(err));
      }
      return res.status(400).json({ message: "این اسلاگ قبلا اضافه شده است" });
    }

    category = new Categories({
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
    // اگر خطا خورد و فایلی آپلود شده بود، پاکش کن
    if (req.file) {
      fs.unlink(req.file.path, (err) => console.log(err));
    }
    next(error);
  }
};

exports.getCategories = async (req, res, next) => {
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

exports.deleteCategory = async (req, res, next) => {
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
