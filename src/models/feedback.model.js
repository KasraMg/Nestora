const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: [1, "امتیاز باید حداقل 1 باشد"],
      max: [5, "امتیاز نمی‌تواند بیشتر از 5 باشد"],
    },
    show: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Feedback", feedbackSchema);
