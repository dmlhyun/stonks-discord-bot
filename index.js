require("dotenv").config();
const { Client } = require("discord.js");
const { createClient } = require('redis');
const {
  commandParser,
  parseStockResponse,
  embeddedStockMessage,
  parseNewsResponse,
  embeddedNewsMessage
} = require("./helper");
const { getNews } = require('./news');
const { getStockOverview, getStockQuote } = require('./stock');

const TOKEN = process.env.DISCORD_TOKEN;

const discord = new Client();
const redis = createClient();

redis.on('error', (err) => console.log('Redis Client Error', err));

discord.on("ready", () => {
  console.log(`Logged in as ${discord.user.tag}!`);
});

const STONK_PREFIX = "?stonk";
const NEWS_PREFIX = "?news";

discord.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content === "ping") {
    message.channel.send("Pong!");
  }

  if (message.content.startsWith(STONK_PREFIX)) {
    const { args } = commandParser({ message, prefix: STONK_PREFIX });

    Promise.all([getStockQuote(args[0]), getStockOverview(args[0])])
      .then(([quoteData, overviewData]) => {
        const parsedData = parseStockResponse({ quoteData, overviewData });
        console.log(parsedData);
        message.channel.send(embeddedStockMessage(parsedData));
      })
      .catch((error) => {
        console.log(error);
        message.channel.send("Oops something went wrong");
      });
  }

  if (message.content.startsWith(NEWS_PREFIX)) {
    const { args } = commandParser({ message, prefix: NEWS_PREFIX });

    Promise.all([getNews(args[0])])
      .then(([news]) => {
        const parsedData = parseNewsResponse(news);
        console.log(news);
        parsedData.forEach(article => {
          message.channel.send(embeddedNewsMessage(article));
        });
      })
      .catch((error) => {
        console.log(error);
        message.channel.send("Oops something went wrong");
      });
  }
});

discord.login(TOKEN);
