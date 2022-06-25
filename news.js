require("dotenv").config();
const axios = require("axios");
const { redisClient, CACHE_TTL } = require('./cache');
const { NEWS_PREFIX } = require('./constants');

const API_KEY = process.env.NEWS_API_TOKEN;
const BASE_URL = process.env.NEW_BASE_URL;

const getNews = async (query) => {
  const cacheKey = `${NEWS_PREFIX}_${query}`;
  const cacheValue = await redisClient.get(cacheKey);

  if (cacheValue) {
    return JSON.parse(cacheValue)
  }

  const response = await axios
    .get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        apiKey: API_KEY,
        pageSize: 3,
      },
    })
    .then((response) => {
      const { data } = response;
      return data;
    });

  await redisClient.set(cacheKey, JSON.stringify(response), { EX: CACHE_TTL })

  return response
}

module.exports = {
  getNews
}
