const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "لطفاً رمز عبور را وارد کنید"],
      minlength: [6, "رمز عبور باید حداقل 6 کاراکتر باشد"],
    },
    name: { type: String, required: [true, "نام الزامی است"] },
    email: { type: String, required: [true, "ایمیل الزامی است"] },
    phone: { type: Number, required: [true, "تلفن الزامی است"], unique: true },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);
