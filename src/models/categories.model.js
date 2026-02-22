const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم کتگوری الزامی است"],
    },
    slug: {
      type: String,
      required: [true, "اسلاگ کتگوری الزامی است"],
    },
    image: {
      type: String,
      required: [true, "تصویر کتگوری الزامی است"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Categories", categoriesSchema);
