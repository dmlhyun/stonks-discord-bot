const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL
const CACHE_TTL = 60 * 15

const client = redis.createClient(REDIS_URL);

client.connect()

module.exports = {
  redisClient: client,
  CACHE_TTL
};