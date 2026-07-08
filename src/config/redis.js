const { createClient } = require("redis");
const env = require("./env");

const redisClient = createClient({
  url: env.REDIS_URL,
  socket: {
    connectTimeout: 1000,
    reconnectStrategy: false,
  },
});

redisClient.on("connect", () => {
  console.log("🟡 Redis Connecting...");
});

redisClient.on("ready", () => {
  console.log("🟢 Redis Ready");
});

redisClient.on("end", () => {
  console.log("🔴 Redis Disconnected");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error:", err.message);
});

module.exports = redisClient;