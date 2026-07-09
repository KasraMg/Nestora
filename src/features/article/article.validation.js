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
    name: z.string().trim().min(1).optional(),
    slug: z.string().trim().min(1).optional(),
    image: z.string().trim().min(1).optional(),
    short_description: z.string().trim().min(1).optional(),
    body: z.string().trim().min(1).optional(),
    isActive: z.preprocess((value) => value === "true", z.boolean()).optional(),
  }),
});

module.exports = {
  createArticleSchema,
  updateArticleSchema,
};
