const { z } = require("zod");
const { slug, code, objectId } = require("../../utils/validators");
const { optionalString } = require("../../utils/helpers");

const colorSchema = z.object({
  name: z.string(),
  code: z.string(),
});

const detailSchema = z.object({
  key: z.string(),
  value: z.string(),
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
    category: objectId,

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
  params: z.object({
    code: z.coerce.number({
      required_error: "کد محصول الزامی است",
      invalid_type_error: "کد محصول باید عدد باشد",
    }),
  }),

  body: z.object({
    name: optionalString("نام محصول حداقل باید ۲ کاراکتر باشد", 2),

    slug: optionalString("اسلاگ حداقل باید ۲ کاراکتر باشد", 2),

    code: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number()
        .int("کد محصول معتبر نیست")
        .min(1, "کد محصول باید بیشتر از صفر باشد")
        .optional(),
    ),

    category: z.preprocess(
      (value) => (value === "" ? undefined : value),
      objectId.optional(),
    ),

    description: optionalString("توضیحات محصول کوتاه است", 10),

    price: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().positive("قیمت باید بیشتر از صفر باشد").optional(),
    ),

    priceWithoutOff: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce
        .number()
        .positive("قیمت قبل از تخفیف باید بیشتر از صفر باشد")
        .optional(),
    ),

    off: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().min(0).max(100).optional(),
    ),

    star: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().min(0).max(5).optional(),
    ),

    colors: z.preprocess((value) => {
      if (!value || value === "") return undefined;

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }

      return value;
    }, z.array(colorSchema).optional()),

    details: z.preprocess((value) => {
      if (!value || value === "") return undefined;

      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }

      return value;
    }, z.array(detailSchema).optional()),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
