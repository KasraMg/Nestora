const { z } = require("zod");
const { slug } = require("../../utils/validators");

exports.createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "نام دسته‌بندی الزامی است" })
      .trim()
      .min(2)
      .max(100),

    slug,

    description: z
      .string({ required_error: "توضیحات الزامی است" })
      .trim()
      .min(5),

    isActive: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
  }),
});

exports.deleteCategorySchema = z.object({
  params: z.object({
    slug,
  }),
});
