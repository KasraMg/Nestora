const mongoose = require("mongoose");

const articlesSchema = new mongoose.Schema(
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
    short_description: {
      type: String,
      required: [true, "پیش نویس الزامی است"],
    },
    body: {
      type: String,
      required: [true, "متن اصلی الزامی است"],
    },
    category: {
      type: String,
      required: [true, "نوع مقاله الزامی است"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Articles", articlesSchema);
