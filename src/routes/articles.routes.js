console.log("Articles routes loaded");

const express = require("express");
const router = express.Router();
const { createArticle, getArticle, deleteArticle, getArticles, editArticle } = require("../controllers/articles.controller");

router.post(
  "/article",
  /*  
      #swagger.tags = ['Articles']
      #swagger.summary = 'Create article'
      */
  createArticle,
);
router.get(
  "/articles/:slug",
  /*  
      #swagger.tags = ['Articles']
      #swagger.summary = 'Get article by slug' 
      */
  getArticle,
);
router.put(
  "/articles/:slug",
  /*  
      #swagger.tags = ['Articles']
      #swagger.summary = 'Edit article by slug' 
      */
  editArticle,
);
router.get(
  "/articles",
  /*  
      #swagger.tags = ['Articles']
      #swagger.summary = 'Get articles' 
      */
  getArticles,
);
router.delete(
  "/articles/:slug",
  /*  
      #swagger.tags = ['Articles']
      #swagger.summary = 'Delete article by slug' 
      */
  deleteArticle,
);
module.exports = router;
