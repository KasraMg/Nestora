const User = require("../models/user.model");
const Feedback = require("../models/feedback.model");
const Products = require("../models/products.model");
const AppError = require("../utils/AppError");

exports.createFeedback = async (req, res, next) => {
  const { code } = req.params;
  const { comment, rating } = req.body;

  try {
    const user = req.user;
    const product = await Products.findOne({ code });
    if (!product) {
      return next(new AppError("محصولی با این کد یافت نشد", 404));
    }

    const feedback = new Feedback({
      comment: comment,
      rating: rating,
      product: product._id,
      user: user._id,
    });
    await feedback.save();

    res.status(201).json({
      messgage:
        "نظر شما با موفقیت ثبت و پس از تایید ادمین، نمایش خواهد داده شد",
    });
  } catch (error) {
    next(error);
  }
};

exports.editFeedback = async (req, res, next) => {
  const { id } = req.params;
  const { comment, rating, show } = req.body;

  try {
    const user = req.user;
    const feedback = await Feedback.findById(id);

    if (comment !== undefined) feedback.comment = comment;
    if (rating !== undefined) feedback.rating = rating;
    if (show !== undefined) feedback.show = show;

    await feedback.save();

    res.status(200).json({
      messgage: "نظر با موفقیت تغییر یافت",
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const feedback = await Feedback.findById(id);

    if (
      user._id.toString() == feedback.user.toString() ||
      user.role == "admin"
    ) {
      const deleteFeedback = await Feedback.findByIdAndDelete(id);

      if (deleteFeedback) {
        return res.status(200).json({ message: "نظر با موفقیت حذف شد" });
      }
    } else {
      return next(new AppError("شما دسترسی برای حذف این نظر ندارید", 403));
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserFeedbacks = async (req, res, next) => {
  try {
    const user = req.user;
    const feedback = await Feedback.find({ user: req.user.id });
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};

exports.getProductFeedbacks = async (req, res, next) => {
  try {
    const { code } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const product = await Products.findOne({ code });

    if (!product) {
      return next(new AppError("محصولی با این کد یافت نشد", 404));
    }

    const feedbacks = await Feedback.find({ product: product._id })
      .populate("user", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Feedback.countDocuments({
      product: product._id,
    });

    const stats = await Feedback.aggregate([
      {
        $match: { product: product._id },
      },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const mainRate = stats.length > 0 ? stats[0].avgRating : 0;

    res.status(200).json({
      mainRate,
      total,
      page,
      pages: Math.ceil(total / limit),
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};
