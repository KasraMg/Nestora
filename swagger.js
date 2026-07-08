const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Homano API",
      description: "API Documentation for Homano",
      version: "1.0.0",
      // contact: {
      //   name: "پشتیبانی",
      //   email: "support@shop.com",
      // },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/features/**/*.routes.js"],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
