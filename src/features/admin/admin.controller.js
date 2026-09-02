const adminService = require("./admin.service");

const getAdminStats = async (req, res, next) => {
  try {
    const stats = await adminService.getAdminStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
};
