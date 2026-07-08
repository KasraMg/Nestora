const rateLimit = require("express-rate-limit");

const createLimiter = (windowMs, max) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message:
        "تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.",
    },
  });

exports.loginLimiter = createLimiter(15 * 60 * 1000, 5);

exports.registerLimiter = createLimiter(60 * 60 * 1000, 3);

exports.changePasswordLimiter = createLimiter(60 * 60 * 1000, 5);

exports.orderLimiter = createLimiter(60 * 60 * 1000, 10);

exports.feedbackLimiter = createLimiter(60 * 60 * 1000, 10);

exports.ticketLimiter = createLimiter(60 * 60 * 1000, 10);

exports.ticketMessageLimiter = createLimiter(10 * 60 * 1000, 20);

exports.defaultLimiter = createLimiter(15 * 60 * 1000, 300);
