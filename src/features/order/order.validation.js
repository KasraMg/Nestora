const { z } = require("zod");

exports.getOrderSchema = z.object({
  params: z.object({
    trackingCode: z
      .string({
        required_error: "کد رهگیری الزامی است",
      })
      .min(5)
      .max(5),
  }),
});

exports.createOrderSchema = z.object({
  body: z.object({
    information: z.object({
      firstName: z
        .string({
          required_error: "نام الزامی است",
        })
        .trim()
        .min(2),

      lastName: z
        .string({
          required_error: "نام خانوادگی الزامی است",
        })
        .trim()
        .min(2),

      method: z.enum(["tipax", "post", "pishtaz"], {
        error: "روش ارسال معتبر نیست",
      }),

      postalCode: z
        .string({
          required_error: "کد پستی الزامی است",
        })
        .regex(/^\d{10}$/, "کد پستی باید ۱۰ رقم باشد"),

      address: z
        .string({
          required_error: "آدرس الزامی است",
        })
        .trim()
        .min(5),

      city: z.object({
        cityId: z.string(),
        cityName: z.string(),
        provinceId: z.string(),
      }),

      province: z.object({
        provinceId: z.string(),
        provinceName: z.string(),
      }),
    }),
  }),
});