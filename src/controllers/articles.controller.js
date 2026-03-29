const Articles = require("../models/articles.model");

exports.createArticle = async (req, res) => {
  const { name, slug, image, body, short_description, category, isActive } =
    req.body;
  try {
    let article = await Articles.findOne({ slug });
    if (article)
      return res.status(400).json({
        message: "قبلا مقاله ای با این اسلاگ ثبت شده است",
      });

    article = new Articles({
      body,
      image,
      name,
      short_description,
      slug,
      category,
      isActive,
    });
    await article.save();

    res.status(201).json({
      message: "مقاله با موفقیت ساخته شد",
      article: {
        body: article.body,
        image: article.image,
        name: article.name,
        short_description: article.short_description,
        slug: article.slug,
        id: article._id,
        category: article.category,
        isActive: article.isActive,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    next(error);
  }
};

exports.getArticle = async (req, res) => {
  const { slug } = req.params;
  try {
    let article = await Articles.findOne({ slug });
    if (!article)
      return res.status(404).json({
        message: "مقاله ای با این اسلاگ یافت نشد",
      });

    res.status(200).json({
      message: "مقاله با موفقیت یافت شد",
      article,
    });
  } catch (error) {
    next(error);
  }
};

exports.getArticles = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { name, category } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    let articles = await Articles.find(filter).skip(skip).limit(limit);
    if (articles.length == 0)
      return res.status(404).json({
        message: "مقاله ای یافت نشد",
      });

    res.status(200).json({
      message: "لیست مقالات با موفقیت یافت شد",
      articles,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "اسلاگ مقاله ارسال نشده است" });
    }

    const deletedArticle = await Articles.findOneAndDelete({
      slug,
    });

    if (!deletedArticle) {
      return res.status(404).json({ message: "مقاله ای یافت نشد" });
    }

    return res.status(200).json({
      message: "مقاله با موفقیت حذف شد",
      product: deletedArticle,
    });
  } catch (error) {
    next(error);
  }
};

exports.editArticle = async (req, res) => {
  const { slug } = req.params;
  const { name, newSlug, image, body, short_description, category, isActive } =
    req.body;

  try {
    const article = await Articles.findOne({ slug });
    if (!article) {
      return res
        .status(404)
        .json({ message: "مقاله ای با این اسلاگ یافت نشد" });
    }

    if (name !== undefined) article.name = name;
    if (newSlug !== undefined) article.slug = newSlug;
    if (image !== undefined) article.image = image;
    if (body !== undefined) article.body = body;
    if (short_description !== undefined)
      article.short_description = short_description;
    if (category !== undefined) article.category = category;
    if (isActive !== undefined) article.isActive = isActive;

    await article.save();

    res.status(200).json({
      message: "مقاله با موفقیت ویرایش شد",
      article,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
    res.status(500).json({ message: "خطایی در ویرایش مقاله رخ داد" });
  }
};
