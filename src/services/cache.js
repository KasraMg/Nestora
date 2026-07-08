const redisClient = require("../config/redis");

const DEFAULT_TTL = 60 * 5;

const getCache = async (key) => {
  if (!redisClient.isReady) {
    return null;
  }

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`❌ Redis GET Error (${key}):`, err.message);
    return null;
  }
};

const setCache = async (key, data, ttl = DEFAULT_TTL) => {
  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: ttl,
    });
  } catch (err) {
    console.error(`❌ Redis SET Error (${key}):`, err.message);
  }
};

const deleteCache = async (key) => {
  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`❌ Redis DEL Error (${key}):`, err.message);
  }
};

const clearCache = async () => {
  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.flushAll();
  } catch (err) {
    console.error("❌ Redis FLUSH Error:", err.message);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  clearCache,
};