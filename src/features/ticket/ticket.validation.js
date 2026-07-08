const { z } = require("zod");

const createTicketSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: "عنوان تیکت الزامی است",
      })
      .trim()
      .min(3, "عنوان حداقل باید ۳ کاراکتر باشد")
      .max(100, "عنوان نمی‌تواند بیشتر از ۱۰۰ کاراکتر باشد"),

    body: z
      .string({
        required_error: "متن پیام الزامی است",
      })
      .trim()
      .min(5, "متن پیام خیلی کوتاه است")
      .max(3000, "متن پیام بیش از حد طولانی است"),
  }),
});

const addMessageSchema = z.object({
  body: z.object({
    body: z
      .string({
        required_error: "متن پیام الزامی است",
      })
      .trim()
      .min(1, "متن پیام نمی‌تواند خالی باشد")
      .max(3000, "متن پیام بیش از حد طولانی است"),
  }),

  params: z.object({
    id: z.string().trim().min(1, "شناسه تیکت الزامی است"),
  }),
});

const ticketIdSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "شناسه تیکت الزامی است"),
  }),
});

module.exports = {
  createTicketSchema,
  addMessageSchema,
  ticketIdSchema,
};