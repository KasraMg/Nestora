const Articles = require("../models/articles.model");
const AppError = require("../utils/AppError");

exports.createArticle = async (req, res, next) => {
  const { name, slug, body, short_description, isActive } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    let article = await Articles.findOne({ slug });

    article = new Articles({
      body,
      image,
      name,
      short_description,
      slug,
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
        isActive: article.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getArticle = async (req, res, next) => {
  const { slug } = req.params;
  try {
    let article = await Articles.findOne({ slug });
    if (!article)
      return next(new AppError("مقاله ای با این اسلاگ یافت نشد", 404));

    res.status(200).json({
      message: "مقاله با موفقیت یافت شد",
      article,
    });
  } catch (error) {
    next(error);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const { name, sort } = req.query;

    const filter = {};
    if (name) {
      filter.name = { $regex: String(name).trim(), $options: "i" };
    }

    let sortStage = { createdAt: -1 };
    if (sort) {
      if (sort.startsWith("-")) {
        const key = sort.substring(1);
        sortStage = { [key]: -1 };
      } else {
        const key = sort;
        sortStage = { [key]: 1 };
      }
    }
    const total = await Articles.countDocuments(filter);

    const articles = await Articles.find(filter)
      .sort(sortStage)
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "لیست مقالات با موفقیت یافت شد",
      articles,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return next(new AppError("اسلاگ مقاله ارسال نشده است", 400));
    }

    const deletedArticle = await Articles.findOneAndDelete({
      slug,
    });

    if (!deletedArticle) {
      return next(new AppError("مقاله ای با این اسلاگ یافت نشد", 404));
    }

    return res.status(200).json({
      message: "مقاله با موفقیت حذف شد",
      product: deletedArticle,
    });
  } catch (error) {
    next(error);
  }
};

exports.editArticle = async (req, res, next) => {
  const { slug } = req.params;
  const { name, newSlug, body, short_description, isActive } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const article = await Articles.findOne({ slug });
    if (!article) {
      return next(new AppError("مقاله ای با این اسلاگ یافت نشد", 404));
    }

    if (name !== undefined) article.name = name;
    if (newSlug !== undefined) article.slug = newSlug;
    if (image !== undefined) article.image = image;
    if (body !== undefined) article.body = body;
    if (short_description !== undefined)
      article.short_description = short_description;
    if (isActive !== undefined) article.isActive = isActive;

    await article.save();

    res.status(200).json({
      message: "مقاله با موفقیت ویرایش شد",
      article,
    });
  } catch (error) {
    next(error);
  }
};
