const { z } = require("zod");

const toggleWishlistSchema = z.object({
  params: z.object({
    code: z.coerce
      .number({
        required_error: "کد محصول الزامی است",
      })
      .int("کد محصول معتبر نیست")
      .positive("کد محصول معتبر نیست"),
  }),
});

module.exports = {
  toggleWishlistSchema,
};