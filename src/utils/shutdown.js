const mongoose = require("mongoose");
const redisClient = require("../config/redis");

let isShuttingDown = false;

const gracefulShutdown = async (server) => {
  if (isShuttingDown) return;

  isShuttingDown = true;

  server.close(async () => {
    try {
      await redisClient.quit();
      console.log("Redis closed");
    } catch (err) {
      console.log("Redis close error:", err.message);
    }

    try {
      await mongoose.connection.close();
    } catch (err) {
      console.log("Mongo close error:", err.message);
    }
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10000);
};

module.exports = gracefulShutdown;
