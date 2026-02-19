const redisClient = require("../config/redis");

const rateLimiter = (limit, windowInSeconds, type) => {
  return async (req, res, next) => {
    try {
      const userId = req.result._id.toString();
      const key = `rate:${type}:${userId}`;
      const now = Date.now();
      const windowStart = now - windowInSeconds * 1000;

      // Remove old requests
      await redisClient.zRemRangeByScore(key, 0, windowStart);

      // Count current requests
      const requestCount = await redisClient.zCard(key);

      if (requestCount >= limit) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
        });
      }

      // Add new request
      await redisClient.zAdd(key, {
        score: now,
        value: now.toString(),
      });

      // Set expiry
      await redisClient.expire(key, windowInSeconds);

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      next();
    }
  };
};

module.exports = rateLimiter;
