require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.NEWS_API_TOKEN;
const BASE_URL = process.env.NEW_BASE_URL;

const getNews = (query) => {
  return axios
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
}

module.exports = {
  getNews
}
