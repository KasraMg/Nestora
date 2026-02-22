const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");

router.post(
  "/register",
  /*  
      #swagger.tags = ['Auth']
      #swagger.summary = 'Register new user' 
      #swagger.responses[201] = {
          description: 'User created successfully' 
      }
  */
  register,
);

router.post(
  "/login",
  /*  
      #swagger.tags = ['Auth']
      #swagger.summary = 'Login user' 
      #swagger.responses[200] = {
          description: 'Login successful' 
      }
  */
  login,
);

router.get(
  "/getMe",
  /*  
      #swagger.tags = ['Auth']
      #swagger.summary = 'Get current user by token'
      #swagger.security = [{
            "bearerAuth": []
      }]
      #swagger.parameters = []
     
  */
  getMe,
);
module.exports = router;
