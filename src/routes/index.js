const router = require("express").Router();

router.use(require("../features/auth/auth.routes"));
router.use(require("../features/user/user.routes"));
router.use(require("../features/product/products.routes"));
router.use(require("../features/banner/banner.routes"));
router.use(require("../features/category/category.routes"));
router.use(require("../features/article/article.routes"));
router.use(require("../features/landing/landing.routes"));
router.use(require("../features/cart/cart.routes"));
router.use(require("../features/wishlist/wishlist.routes"));
router.use(require("../features/feedback/feedback.routes"));
router.use(require("../features/order/order.routes"));
router.use(require("../features/ticket/ticket.routes"));
router.use(require("../features/public/public.routes"));

module.exports = router;
