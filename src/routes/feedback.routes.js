const express = require("express");
const {
  createFeedback,
  editFeedback,
  deleteFeedback,
  getUserFeedbacks,
  getProductFeedbacks,
} = require("../controllers/feedback.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.get(
  "/getUserFeedbacks",
  /*  #swagger.tags = ['Feedback']
      #swagger.summary = 'get user feedbacks' 
  */
  authMiddleware,
  getUserFeedbacks,
);
router.get(
  "/getProductFeedbacks/:code",
  /*  #swagger.tags = ['Feedback']
      #swagger.summary = 'get product feedbacks' 
  */
  getProductFeedbacks,
);
router.post(
  "/createFeedback/:code",
  /*  #swagger.tags = ['Feedback']
      #swagger.summary = 'create feedback for products' 
  */
  authMiddleware,
  createFeedback,
);

router.put(
  "/editFeedback/:id",
  /*  #swagger.tags = ['Feedback']
      #swagger.summary = 'edit products feedback' 
  */
  authMiddleware,
  editFeedback,
);
router.delete(
  "/deleteFeedback/:id",
  /*  #swagger.tags = ['Feedback']
      #swagger.summary = 'delete feedback' 
  */
  authMiddleware,
  deleteFeedback,
);
module.exports = router;
