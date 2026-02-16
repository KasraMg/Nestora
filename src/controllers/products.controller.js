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
    const { price, category } = req.query;

    const filter = {};

    if (price) {
      filter.price = Number(price);
    }

    if (category) {
      filter.category = category;
    }

    const products = await Products.find(filter);

    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({
      message: "خطا در دریافت محصولات",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, priceWithoutOff, star, off, image, category, code } =
    req.body;

  try {
    let product = await Products.findOne({ code });
    if (product)
      return res.status(400).json({ message: "product already exists" });

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
