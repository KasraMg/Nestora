const Article = require("../models/article.model");
const AppError = require("../utils/AppError");

exports.createArticle = async (user, data, file) => {
  const { name, slug, body, short_description, isActive } = data;
  const image = file ? `/uploads/${file.filename}` : null;

  const exists = await Article.findOne({ slug });

  if (exists) {
    throw new AppError("این اسلاگ قبلا ثبت شده است", 400);
  }

  const article = new Articles({
    body,
    image,
    name,
    short_description,
    slug,
    isActive,
    user: user._id,
  });
  return await article.save();
};

exports.getArticle = async (slug) => {
  let article = await Article.findOne({ slug }).populate("user");
  if (!article) throw new AppError("مقاله ای با این اسلاگ یافت نشد", 404);
  const articles = await Article.find().sort({ createdAt: -1 }).limit(10);
  return { article, articles };
};

exports.getArticles = async (data) => {
  const { name, sort, page, limit } = data;
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.max(1, Math.min(100, Number(limit) || 10));

  const skip = (pageNumber - 1) * limitNumber;

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
  const total = await Article.countDocuments(filter);

  const articles = await Article.find(filter)
    .sort(sortStage)
    .skip(skip)
    .limit(limit);

  return { articles, page: pageNumber, limit: limitNumber, total };
};

exports.deleteArticle = async (slug) => {
  if (!slug) {
    throw new AppError("اسلاگ مقاله ارسال نشده است", 400);
  }

  const deletedArticle = await Article.findOneAndDelete({
    slug,
  });

  if (!deletedArticle) {
    throw new AppError("مقاله ای با این اسلاگ یافت نشد", 404);
  }
};

exports.editArticle = async (slug, data, file) => {
  const { name, newSlug, body, short_description, isActive } = data;
  const image = file ? `/uploads/${file.filename}` : null;

  const article = await Article.findOne({ slug });

  if (!article) {
    throw new AppError("مقاله ای با این اسلاگ یافت نشد", 404);
  }

  if (newSlug && newSlug !== slug) {
    const exists = await Article.findOne({ slug: newSlug });

    if (exists) {
      throw new AppError("این اسلاگ قبلاً ثبت شده است", 400);
    }
  }

  if (name !== undefined) article.name = name;
  if (newSlug !== undefined) article.slug = newSlug;
  if (image !== undefined) article.image = image;
  if (body !== undefined) article.body = body;
  if (short_description !== undefined)
    article.short_description = short_description;
  if (isActive !== undefined) article.isActive = isActive;

  return await article.save();
};
