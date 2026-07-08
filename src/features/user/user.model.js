const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "نام کاربری الزامی است"] },
    phone: { type: Number, required: true, unique: true },
    password: {
      type: String,
      required: [true, "پسورد الزامی است"],
      select: false,
    },
    email: { type: String, default: null },
    birthDate: { type: String, default: null },
    nationalCode: { type: String, default: null },
    wishlist: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    addresses: {
      type: [
        {
          postalCode: {
            type: String,
            required: [true, "کد پستی الزامی است"],
            match: [/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"],
          },
          address: {
            type: String,
            required: [true, "  آدرس الزامی است"],
          },
          city: {
            cityId: {
              type: String,
              required: [true, "شناسه شهر الزامی است"],
            },
            cityName: {
              type: String,
              required: true,
            },
            provinceId: {
              type: String,
              required: true,
            },
          },
          province: {
            provinceId: {
              type: String,
              required: [true, "شناسه استان الزامی است"],
            },
            provinceName: {
              type: String,
              required: true,
            },
          },
        },
      ],
      default: [],
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
