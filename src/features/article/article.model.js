const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم کتگوری الزامی است"],
    },
    slug: {
      type: String,
      required: [true, "اسلاگ کتگوری الزامی است"],
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Article", articleSchema);
