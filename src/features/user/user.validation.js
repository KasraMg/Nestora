const { z } = require("zod");
const { phone } = require("../../utils/validators");

const editUserSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "نام باید حداقل ۲ کاراکتر باشد")
      .max(100)
      .optional(),

    phone,

    email: z.string().email("ایمیل معتبر نیست").optional(),

    birthDate: z.string().trim().optional(),

    nationalCode: z
      .string()
      .regex(/^\d{10}$/, "کد ملی معتبر نیست")
      .optional(),
  }),
});

const createAddressSchema = z.object({
  body: z.object({
    postalCode: z
      .string({
        required_error: "کد پستی الزامی است",
      })
      .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),

    address: z
      .string({
        required_error: "آدرس الزامی است",
      })
      .trim()
      .min(5, "آدرس کوتاه است"),

    city: z.object({
      cityId: z.string().trim().min(1),
      cityName: z.string().trim().min(1),
      provinceId: z.string().trim().min(1),
    }),

    province: z.object({
      provinceId: z.string().trim().min(1),
      provinceName: z.string().trim().min(1),
    }),
  }),
});

const addressIdSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "شناسه آدرس الزامی است"),
  }),
});

module.exports = {
  editUserSchema,
  createAddressSchema,
  addressIdSchema,
};
