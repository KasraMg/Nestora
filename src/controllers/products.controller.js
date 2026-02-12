const Products = require("../models/products.model");

exports.getProducts = async (req, res) => {};

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
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(" ") });
    }
  }
};
