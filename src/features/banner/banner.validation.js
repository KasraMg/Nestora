const { z } = require("zod");

const createBannerSchema = z.object({
  body: z.object({
    url: z
      .string({
        required_error: "آدرس بنر الزامی است",
      })
      .trim()
      .min(1, "آدرس بنر الزامی است"),

    position: z
      .string({
        required_error: "جایگاه بنر الزامی است",
      })
      .trim()
      .min(1, "جایگاه بنر الزامی است"),

    isActive: z.boolean().optional(),
  }),
});

module.exports = {
  createBannerSchema,
};
