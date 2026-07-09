const { z } = require("zod");

exports.phone = z.preprocess(
  (value) => String(value),
  z.string().regex(/^\d{10,11}$/, "شماره موبایل معتبر نیست"),
);

exports.objectId = z.string().regex(/^[a-f\d]{24}$/i, "شناسه معتبر نیست");

exports.password = z
  .string()
  .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
  .max(100);

exports.slug = z
  .string({
    required_error: "اسلاگ الزامی است",
  })
  .trim()
  .min(2)
  .max(100);

exports.code = z.coerce
  .number({
    required_error: "کد الزامی است",
    invalid_type_error: "کد باید عدد باشد",
  })
  .int("کد محصول معتبر نیست")
  .min(1);
