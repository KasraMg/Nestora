const landingService = require("./landing.service");

exports.getLandingData = async (req, res, next) => {
  try {
    const data = await landingService.getLandingData();

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
