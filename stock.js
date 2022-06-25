require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.ALPHA_VANTAGE_API_TOKEN;
const BASE_URL = process.env.ALPHA_VANTAGE_BASE_URL;

const getStockOverview = (query) => {
  return axios
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
}

const getStockQuote = (query) => {
  return axios
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
}

module.exports = {
  getStockOverview,
  getStockQuote
}
