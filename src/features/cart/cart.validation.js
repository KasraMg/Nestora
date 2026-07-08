const { z } = require("zod");
const { code } = require("../../utils/validators");
exports.addToCartSchema = z.object({
  body: z.object({
    code,

    color: z
      .string({
        required_error: "رنگ محصول الزامی است",
      })
      .min(1, "رنگ محصول الزامی است"),
  }),
});

exports.updateCartItemQuantitySchema = z.object({
  body: z.object({
    id: z
      .string({
        required_error: "شناسه محصول الزامی است",
      })
      .min(1),

    action: z.enum(["plus", "minus"], {
      errorMap: () => ({
        message: "عملیات معتبر نیست",
      }),
    }),
  }),
});

exports.removeCartItemSchema = z.object({
  params: z.object({
    id: z.string().min(1, "شناسه محصول الزامی است"),
  }),
});
