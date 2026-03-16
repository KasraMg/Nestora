const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  impersonateUser,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

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
      #swagger.parameters['authorization'] = {
            in: 'header',
            description: 'Bearer token',
            required: true,
            type: 'string'
      }
      #swagger.responses[200] = {
            description: 'User data'
      }
  */
  authMiddleware,
  getMe,
);

router.post(
  "/impersonate/:userId",
  /*  
      #swagger.tags = ['Auth']
 
  */
  authMiddleware,
  adminMiddleware,
  impersonateUser,
);

module.exports = router;
