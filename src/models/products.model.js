const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "اسم رنگ الزامی است"],
    trim: true,
  },
  code: {
    type: String,
    required: [true, "کد رنگ الزامی است"],
    match: [
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "فرمت کد رنگ باید #RGB یا #RRGGBB باشه",
    ],
  },
});

const detailSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم کالا الزامی است"],
    },
    price: { type: Number, required: [true, "قیمت کالا الزامی است"] },
    priceWithoutOff: { type: Number, default: null },
    star: { type: Number, required: [true, "امتیاز الزامی است"] },
    off: { type: Number, default: null },
    description: { type: String, default: null },
    images: { type: [{ type: String }], required: [true, "تصویر الزامی است"] },
    category: { type: String, required: [true, "دسته بندی الزامی است"] },
    code: {
      type: String,
      required: [true, "کد کالا الزامی است "],
      unique: true,
    },
    colors: {
      type: [colorSchema],
      default: [],
    },
    details: { type: [detailSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Products", productSchema);
