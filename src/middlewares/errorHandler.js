const errorHandler = (err, req, res, next) => { 
  let statusCode = err.statusCode || 500;
  let message = err.message || "خطای داخلی سرور";
 
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)[0].message;
  }

  res.status(statusCode).json({
    message,
  });
};

module.exports = errorHandler;
