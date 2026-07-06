const Feedback = require("../models/feedback.model");
const Products = require("../models/products.model");
const AppError = require("../utils/AppError");

exports.createFeedback = async (user, code, data) => {
  const { comment, rating } = data;

  const product = await Products.findOne({ code });

  if (!product) {
    throw new AppError("محصولی با این کد یافت نشد", 404);
  }

  const feedback = new Feedback({
    comment,
    rating,
    product: product._id,
    user: user._id,
  });

  await feedback.save();

  return feedback;
};

exports.editFeedback = async (id, data) => {
  const { comment, rating, show } = data;

  const feedback = await Feedback.findById(id);

  if (!feedback) {
    throw new AppError("نظر یافت نشد", 404);
  }

  if (comment !== undefined) feedback.comment = comment;
  if (rating !== undefined) feedback.rating = rating;
  if (show !== undefined) feedback.show = show;

  return await feedback.save();
};

exports.deleteFeedback = async (user, id) => {
  const feedback = await Feedback.findById(id);

  if (!feedback) {
    throw new AppError("نظر یافت نشد", 404);
  }

  const isOwner =
    feedback.user.toString() === user._id.toString();

  if (!isOwner && user.role !== "admin") {
    throw new AppError(
      "شما دسترسی برای حذف این نظر ندارید",
      403
    );
  }

  await Feedback.findByIdAndDelete(id);
};

exports.getUserFeedbacks = async (user) => {
  return await Feedback.find({
    user: user._id,
  });
};

exports.getProductFeedbacks = async (code, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const product = await Products.findOne({ code });

  if (!product) {
    throw new AppError("محصولی با این کد یافت نشد", 404);
  }

  const feedbacks = await Feedback.find({
    product: product._id,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Feedback.countDocuments({
    product: product._id,
  });

  const stats = await Feedback.aggregate([
    {
      $match: {
        product: product._id,
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: {
          $avg: "$rating",
        },
      },
    },
  ]);

  return {
    feedbacks,
    total,
    page,
    pages: Math.ceil(total / limit),
    mainRate:
      stats.length > 0 ? stats[0].avgRating : 0,
  };
};