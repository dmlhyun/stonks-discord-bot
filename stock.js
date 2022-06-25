require("dotenv").config();
const axios = require("axios");
const { redisClient, CACHE_TTL } = require('./cache');
const { STONK_PREFIX } = require('./constants');

const API_KEY = process.env.ALPHA_VANTAGE_API_TOKEN;
const BASE_URL = process.env.ALPHA_VANTAGE_BASE_URL;

const getStockOverview = async (query) => {
  const cacheKey = `${STONK_PREFIX}_${query}_overview`;
  const cacheValue = await redisClient.get(cacheKey);

  if (cacheValue) {
    console.log('called cache', cacheKey, cacheValue)
    return JSON.parse(cacheValue)
  }

  const response = await axios
    .get(`${BASE_URL}/query`, {
      params: {
        function: "OVERVIEW",
        symbol: query,
        apikey: API_KEY,
      },
    })
    .then((response) => {
      const { data } = response;
      return data;
    });

  await redisClient.set(cacheKey, JSON.stringify(response), { EX: CACHE_TTL })

  return response
}

const getStockQuote = async (query) => {
  const cacheKey = `${STONK_PREFIX}_${query}_quote`;
  const cacheValue = await redisClient.get(cacheKey);

  if (cacheValue) {
    console.log('called cache', cacheKey, cacheValue)
    return JSON.parse(cacheValue)
  }
  
  const response = await axios
    .get(`${BASE_URL}/query`, {
      params: {
        function: "GLOBAL_QUOTE",
        symbol: query,
        apikey: API_KEY,
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
  getStockOverview,
  getStockQuote
}
