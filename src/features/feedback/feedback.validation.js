const { z } = require("zod");
const { objectId, code } = require("../../utils/validators");

exports.createFeedbackSchema = z.object({
  params: z.object({
    code,
  }),

  body: z.object({
    comment: z
      .string({
        required_error: "متن نظر الزامی است",
      })
      .trim()
      .min(3, "نظر باید حداقل ۳ کاراکتر باشد")
      .max(1000),

    rating: z
      .number({
        required_error: "امتیاز الزامی است",
      })
      .min(1)
      .max(5),
  }),
});

exports.editFeedbackSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: z
    .object({
      comment: z.string().trim().min(3).max(1000).optional(),
      rating: z.number().min(1).max(5).optional(),
      show: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "حداقل یک فیلد برای ویرایش ارسال کنید",
    }),
});

exports.deleteFeedbackSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

exports.getProductFeedbacksSchema = z.object({
  params: z.object({
    code,
  }),

  query: z.object({
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(100).optional(),
  }),
});
