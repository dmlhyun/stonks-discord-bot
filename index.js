require("dotenv").config();
const axios = require("axios");
const { Client } = require("discord.js");
const { commandParser, parseData, embeddedMessage } = require("./helper");

const TOKEN = process.env.TOKEN;
const API_KEY = process.env.ALPHA_VANTAGE_API_TOKEN;
const BASE_URL = process.env.ALPHA_VANTAGE_BASE_URL;

const client = new Client();

axios.defaults.baseURL = BASE_URL;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const PREFIX = "?";

client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content === "ping") {
    message.channel.send("Pong!");
  }

  if (message.content.startsWith(PREFIX)) {
    const { args } = commandParser({ message, prefix: PREFIX });

    const overview = axios
      .get("/query", {
        params: {
          function: "OVERVIEW",
          symbol: args[0],
          apikey: API_KEY,
        },
      })
      .then((response) => {
        const { data } = response;
        return data;
      });

    const quote = axios
      .get("/query", {
        params: {
          function: "GLOBAL_QUOTE",
          symbol: args[0],
          apikey: API_KEY,
        },
      })
      .then((response) => {
        const { data } = response;
        return data;
      });

    Promise.all([quote, overview])
      .then(([quoteData, overviewData]) => {
        const parsedData = parseData({ quoteData, overviewData });
        console.log(parsedData);
        message.channel.send(embeddedMessage(parsedData));
      })
      .catch((error) => {
        console.log(error);
        message.channel.send("Oops something went wrong");
      });
  }
});

client.login(TOKEN);
