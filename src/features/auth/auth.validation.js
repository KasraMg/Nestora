const { z } = require("zod");
const { phone, password } = require("../../utils/validators");

exports.registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "نام الزامی است",
      })
      .trim()
      .min(3, "نام باید حداقل ۳ کاراکتر باشد")
      .max(50, "نام نباید بیشتر از ۵۰ کاراکتر باشد"),

    phone,
    password,
  }),
});

exports.loginSchema = z.object({
  body: z.object({
    phone,
    password,
  }),
});

exports.changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z
        .string({
          required_error: "رمز عبور فعلی الزامی است",
        })
        .min(6),

      newPassword: z
        .string({
          required_error: "رمز عبور جدید الزامی است",
        })
        .min(6, "رمز عبور باید حداقل 6 کاراکتر باشد")
        .max(100),
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: "رمز عبور جدید نباید با رمز عبور فعلی یکسان باشد",
      path: ["newPassword"],
    }),
});
