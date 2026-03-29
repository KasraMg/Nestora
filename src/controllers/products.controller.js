const Products = require("../models/products.model");

exports.getProduct = async (req, res) => {
  try {
    const { code } = req.params;

    const product = await Products.findOne({ code: Number(code) });

    if (!product) {
      return res.status(404).json({ message: "کالایی یافت نشد" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: "خطای سرور" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res.status(400).json({ message: "کد محصول ارسال نشده است" });
    }

    const deletedProduct = await Products.findOneAndDelete({
      code: Number(code),
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: "کالایی یافت نشد" });
    }

    return res.status(200).json({
      message: "محصول با موفقیت حذف شد",
      product: deletedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "خطایی غیر منتظره رخ داد" });
  }
};

exports.getProducts = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { price, category, search, sort, minPrice, maxPrice } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (price) {
      filter.price = Number(price);
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    let sortQuery = {};

    if (sort) {
      if (sort.startsWith("-")) {
        sortQuery[sort.substring(1)] = -1;
      } else {
        sortQuery[sort] = 1;
      }
    }

    const products = await Products.find(filter)
      .sort(sortQuery)
      .skip(skip)
      .limit(limit);

    const total = await Products.countDocuments(filter);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products
    });

  } catch (error) {
    res.status(500).json({
      message: "خطا در دریافت محصولات",
      error: error.message
    });
  }
};



exports.createProduct = async (req, res) => {
  const { name, price, priceWithoutOff, star, off, image, category, code } =
    req.body;

  try {
    let product = await Products.findOne({ code });
    if (product)
      return res.status(400).json({ message: "کالایی با ای شناسه قبلا ثبت شده است" });

    product = new Products({
      name,
      price,
      priceWithoutOff,
      star,
      off,
      code,
      image,
      category,
    });
    await product.save();

    res.status(201).json({
      message: "کالا با موفقیت ساخته شد",
      product: {
        name: product.name,
        price: product.price,
        priceWithoutOff: product.priceWithoutOff,
        star: product.star,
        off: product.off,
        code: product.code,
        image: product.image,
        category: product.category,
        id: product._id,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }
  }
};
