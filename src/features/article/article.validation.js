const { z } = require("zod");
const { slug } = require("../../utils/validators");

const createArticleSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "اسم مقاله الزامی است",
      })
      .trim()
      .min(1, "اسم مقاله الزامی است"),

    slug,

    short_description: z
      .string({
        required_error: "پیش‌نویس الزامی است",
      })
      .trim()
      .min(1, "پیش‌نویس الزامی است"),

    body: z
      .string({
        required_error: "متن اصلی الزامی است",
      })
      .trim()
      .min(1, "متن اصلی الزامی است"),

    isActive: z.preprocess((value) => value === "true", z.boolean()).optional(),
  }),
});

const updateArticleSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    newSlug: z.string().min(1).optional(),
    body: z.string().min(1).optional(),
    short_description: z.string().min(1).optional(),
    isActive: z
      .string()
      .transform((value) => value === "true")
      .optional(),
  }),

  params: z.object({
    slug: z.string().min(1),
  }),

  query: z.object({}).optional(),
});
module.exports = {
  createArticleSchema,
  updateArticleSchema,
};
