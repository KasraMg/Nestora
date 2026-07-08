const { z } = require("zod");
const { slug, code } = require("../../utils/validators");

const colorSchema = z.object({
  name: z
    .string({
      required_error: "نام رنگ الزامی است",
    })
    .trim()
    .min(1, "نام رنگ الزامی است"),

  hex: z
    .string({
      required_error: "کد رنگ الزامی است",
    })
    .trim()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "کد رنگ معتبر نیست"),
});

const detailSchema = z.object({
  title: z
    .string({
      required_error: "عنوان ویژگی الزامی است",
    })
    .trim()
    .min(1, "عنوان ویژگی الزامی است"),

  value: z
    .string({
      required_error: "مقدار ویژگی الزامی است",
    })
    .trim()
    .min(1, "مقدار ویژگی الزامی است"),
});

const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "نام محصول الزامی است",
      })
      .trim()
      .min(2, "نام محصول حداقل باید ۲ کاراکتر باشد"),

    slug,

    code,
    category: z
      .string({
        required_error: "دسته‌بندی الزامی است",
      })
      .trim(),

    description: z
      .string({
        required_error: "توضیحات محصول الزامی است",
      })
      .trim()
      .min(10, "توضیحات محصول کوتاه است"),

    price: z.coerce
      .number({
        required_error: "قیمت الزامی است",
      })
      .positive("قیمت باید بیشتر از صفر باشد"),

    priceWithoutOff: z.coerce
      .number({
        required_error: "قیمت قبل از تخفیف الزامی است",
      })
      .positive(),

    off: z.coerce
      .number()
      .min(0, "تخفیف نمی‌تواند منفی باشد")
      .max(100, "تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد")
      .optional(),

    star: z.coerce.number().min(0).max(5).optional(),

    colors: z
      .preprocess((value) => {
        if (typeof value === "string") {
          return JSON.parse(value);
        }
        return value;
      }, z.array(colorSchema))
      .optional(),

    details: z
      .preprocess((value) => {
        if (typeof value === "string") {
          return JSON.parse(value);
        }
        return value;
      }, z.array(detailSchema))
      .optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),

    slug: z.string().trim().min(2).optional(),

    category: z.string().trim().optional(),

    description: z.string().trim().min(10).optional(),

    code: z.coerce.number().int().positive().optional(),

    price: z.coerce.number().positive().optional(),

    priceWithoutOff: z.coerce.number().positive().optional(),

    off: z.coerce.number().min(0).max(100).optional(),

    star: z.coerce.number().min(0).max(5).optional(),

    colors: z
      .preprocess((value) => {
        if (typeof value === "string") {
          return JSON.parse(value);
        }
        return value;
      }, z.array(colorSchema))
      .optional(),

    details: z
      .preprocess((value) => {
        if (typeof value === "string") {
          return JSON.parse(value);
        }
        return value;
      }, z.array(detailSchema))
      .optional(),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
