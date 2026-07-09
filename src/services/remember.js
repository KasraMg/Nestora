const { getCache, setCache } = require("./cache");

const remember = async (key, callback, ttl) => {
  const cached = await getCache(key);

  if (cached) {
    return cached;
  }

  const data = await callback();

  await setCache(key, data, ttl);

  return data;
};

module.exports = remember;
