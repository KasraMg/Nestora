const express = require("express");
const { getLandingData } = require("../controllers/landing.controller");
const router = express.Router();

router.get(
  "/landing",
  /*
         #swagger.tags = ['Landing']
      #swagger.summary = 'Get landing data'
    */
  getLandingData,
);


module.exports = router;

