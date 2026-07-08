const feedbackService = require("./feedback.service");

exports.createFeedback = async (req, res, next) => {
  try {
    await feedbackService.createFeedback(req.user, req.params.code, req.body);

    res.status(201).json({
      message: "نظر شما با موفقیت ثبت و پس از تایید ادمین، نمایش خواهد داده شد",
    });
  } catch (error) {
    next(error);
  }
};

exports.editFeedback = async (req, res, next) => {
  try {
    const feedback = await feedbackService.editFeedback(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      message: "نظر با موفقیت تغییر یافت",
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    await feedbackService.deleteFeedback(req.user, req.params.id);

    res.status(200).json({
      message: "نظر با موفقیت حذف شد",
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await feedbackService.getUserFeedbacks(req.user);

    res.status(200).json({
      message: "لیست نظرات با موفقیت دریافت شد",
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProductFeedbacks = async (req, res, next) => {
  try {
    const result = await feedbackService.getProductFeedbacks(
      req.params.code,
      req.query,
    );

    res.status(200).json({
      message: "نظرات محصول با موفقیت دریافت شد",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
