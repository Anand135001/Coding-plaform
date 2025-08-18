const {createClient} = require('redis');

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-15328.c301.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 15328,
  },
});

module.exports = redisClient;