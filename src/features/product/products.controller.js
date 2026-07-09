const productService = require("./products.service");

exports.getProduct = async (req, res, next) => {
  try {
    const { code } = req.params;

    const product = await productService.getProduct(
      code,
      req.headers.authorization,
    );
    return res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { code } = req.params;

    await productService.deleteProduct(req.user, code);

    return res.status(200).json({
      message: "محصول با موفقیت حذف شد",
    });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const { page, limit, total, products } = await productService.getProducts(
      req.query,
      req.headers.authorization
    );

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
  try {
    const product = await productService.createProduct(req.body, req.files);

    res.status(201).json({
      message: "کالا با موفقیت ساخته شد",
      product,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.code,
      req.body,
      req.files
    );

    res.status(200).json({
      message: "محصول با موفقیت ویرایش شد",
      product,
    });

  } catch (error) {
    next(error);
  }
};
