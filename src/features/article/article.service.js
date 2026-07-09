const Article = require("./article.model");
const AppError = require("../../utils/app-error");
const cacheKeys = require("../../utils/constants/cache-keys");
const remember = require("../../services/remember");
const { deleteCache } = require("../../services/cache");

exports.createArticle = async (user, data, file) => {
  const { name, slug, body, short_description, isActive } = data;
  const image = file ? `/uploads/${file.filename}` : null;

  const exists = await Article.findOne({ slug });

  if (exists) {
    throw new AppError("این اسلاگ قبلا ثبت شده است", 400);
  }

  const article = new Article({
    body,
    image,
    name,
    short_description,
    slug,
    isActive,
    user: user._id,
  });

  await article.save();

  await Promise.all([
    deleteCache(`${cacheKeys.ARTICLE}-${slug}`),
    deleteCache(cacheKeys.LANDING),
  ]);

  return article;
};

exports.getArticle = async (slug) => {
  const cacheKey = `${cacheKeys.ARTICLE}-${slug}`;

  return remember(cacheKey, async () => {
    const [article, articles] = await Promise.all([
      Article.findOne({ slug }).populate("user").lean(),
      Article.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    if (!article) {
      throw new AppError("مقاله ای با این اسلاگ یافت نشد", 404);
    }

    return {
      article,
      articles,
    };
  });
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
    .limit(limitNumber)
    .lean();

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
  await Promise.all([
    deleteCache(`${cacheKeys.ARTICLE}-${slug}`),
    deleteCache(cacheKeys.LANDING),
  ]);
  
  return deletedArticle
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

  await article.save();

  const promises = [
    deleteCache(`${cacheKeys.ARTICLE}-${slug}`),
    deleteCache(cacheKeys.LANDING),
  ];

  if (newSlug && newSlug !== slug) {
    promises.push(deleteCache(`${cacheKeys.ARTICLE}-${newSlug}`));
  }

  await Promise.all(promises);
  return article;
};
