const articleService = require("./article.service");

exports.createArticle = async (req, res, next) => {
  try {
    const newArticle = await articleService.createArticle(
      req.user,
      req.body,
      req.file,
    );

    res.status(201).json({
      message: "مقاله با موفقیت ساخته شد",
      newArticle,
    });
  } catch (error) {
    next(error);
  }
};

exports.getArticle = async (req, res, next) => {
  const { slug } = req.params;
  try {
    const { article, articles } = await articleService.getArticle(slug);

    res.status(200).json({
      message: "مقاله با موفقیت یافت شد",
      article,
      articles,
    });
  } catch (error) {
    next(error);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    const { articles, limit, page, total } = await articleService.getArticles(
      req.query,
    );

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
    await articleService.deleteArticle(slug);

    return res.status(200).json({
      message: "مقاله با موفقیت حذف شد",
    });
  } catch (error) {
    next(error);
  }
};

exports.editArticle = async (req, res, next) => {
  const { slug } = req.params;

  try {
    const updatedArticle = await articleService.editArticle(
      slug,
      req.body,
      req.file,
    );

    res.status(200).json({
      message: "مقاله با موفقیت ویرایش شد",
      updatedArticle,
    });
  } catch (error) {
    next(error);
  }
};
