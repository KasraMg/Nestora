const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, "عکس بنر الزامی است"],
    },
    url: {
      type: String,
      required: [true, "آدرس بنر الزامی است"],
    },
    position: {
      type: String,
      required: [true, "کتگوری بنر الزامی است"],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Banner", bannerSchema);
