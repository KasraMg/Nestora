const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        sellPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    information: {
      postalCode: {
        type: String,
        required: [true, "کد پستی الزامی است"],
        match: [/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"],
      },
      address: {
        type: String,
        required: [true, "آدرس الزامی است"],
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
      firstName: {
        type: String,
        required: [true, "نام الزامی است"],
      },
      lastName: {
        type: String,
        required: [true, "نام خانوادگی الزامی است"],
      },
       method: {
        type: String,
        required: [true, "روش پرداخت الزامی است"],
      },
    },
    status: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    trackingCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("order", orderSchema);
