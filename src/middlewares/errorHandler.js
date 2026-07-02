const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "خطای داخلی سرور";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)[0].message;
  }

  else if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyPattern)[0];

    const fields = {
      phone: "شماره موبایل",
      email: "ایمیل",
      username: "نام کاربری",
      code: "کد کالا",
      slug: "اسلاگ",
    };

    message = `این ${fields[field] || field} قبلاً ثبت شده است`;
  }

  else if (err.name === "CastError") {
    statusCode = 400;
    message = "شناسه ارسال شده معتبر نیست";
  }

  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "توکن نامعتبر است";
  }

  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "توکن منقضی شده است";
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = errorHandler;