const Products = require("../models/products.model");
const Categories = require("../models/categories.model");

const fs = require("fs");
 
exports.getProduct = async (req, res, next) => {
  try {
    const { code } = req.params;

    const product = await Products.findOne({ code: Number(code) });

    if (!product) {
      return res.status(404).json({ message: "کالایی یافت نشد" });
    }

    return res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
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
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { category, search, minPrice, maxPrice, sort } = req.query;

    const match = {};

    if (category) {
      match.category = category;
    }

    if (search) {
      match.title = { $regex: search.trim(), $options: "i" };
    }

    if (minPrice || maxPrice) {
      match.price = {};
      if (minPrice) match.price.$gte = Number(minPrice);
      if (maxPrice) match.price.$lte = Number(maxPrice);
    }

    let sortStage = { createdAt: -1 };

    if (sort) {
      if (sort.startsWith("-")) {
        sortStage = { [sort.substring(1)]: -1 };
      } else {
        sortStage = { [sort]: 1 };
      }
    }

    const result = await Products.aggregate([
      { $match: match },

      {
        $facet: {
          products: [{ $sort: sortStage }, { $skip: skip }, { $limit: limit }],

          totalCount: [{ $count: "count" }],
        },
      },
    ]);

    const products = result[0].products;
    const total = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  const {
    name,
    price,
    priceWithoutOff,
    star,
    off,
    category,
    code,
    description,
    colors,
    details,
  } = req.body;

  const images = req.files
    ? req.files.map((file) => {
        return `/uploads/${file.filename}`;
      })
    : [];

  try {
    let product = await Products.findOne({ code });
    if (product) {
      if (req.files) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => console.log(err));
        });
      }
      return res
        .status(400)
        .json({ message: "کالایی با این شناسه قبلا ثبت شده است" });
    }
    let isCategory = await Categories.findOne({ slug: category });

    if (!isCategory) {
      return res
        .status(404)
        .json({ message: "کتگوری ای با این شناسه یافت نشد" });
    }

   

    product = new Products({
      name,
      price,
      priceWithoutOff,
      description,
      star,
      off,
      code,
      images,
      category,
      colors: colors || [],
      details: details || [],
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
        images: product.images,
        category: product.category,
        id: product._id,
        description: product.description,
        colors: product.colors,
        details: product.details,
      },
    });
  } catch (error) {
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => console.log(err));
      });
    }
    next(error);
  }
};
