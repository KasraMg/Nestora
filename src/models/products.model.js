const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "اسم کالا الزامی است"],
    },
    price: { type: Number, required: [true, "قیمت کالا الزامی است"] },
    priceWithoutOff: { type: Number, default: null },
    star: { type: Number, required: [true, "امتیاز الزامی است"] },
    off: { type: Number, default: null },
    image: { type: String, required: [true, "تصویر الزامی است"] },
    category: { type: String, required: [true, "دسته بندی الزامی است"] },
    code: {
      type: Number,
      required: [true, "کد کالا الزامی است "],
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Products", productsSchema);
