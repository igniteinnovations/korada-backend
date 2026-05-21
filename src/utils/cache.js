//

import redisClient from "../config/redis.js";

// 🎯 Set Cache with expiry (TTL in seconds)
export const setCache = async (key, value, expiry = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expiry,
    });
  } catch (error) {
    console.error("❌ Cache set error:", error);
  }
};

// 🎯 Get Cache
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("❌ Cache get error:", error);
    return null;
  }
};

// 🎯 Delete Cache
export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("❌ Cache delete error:", error);
  }
};

// 🎯 Clear pattern (e.g., "stats:*")
export const clearCachePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error("❌ Cache pattern clear error:", error);
  }
};

export default {
  setCache,
  getCache,
  deleteCache,
  clearCachePattern,
};
