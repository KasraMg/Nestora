const mongoose = require("mongoose");

const provinceSchema = new mongoose.Schema({
  provinceId: Number,
  provinceName: String,
});

module.exports = mongoose.model("Province", provinceSchema);
