const { MessageEmbed } = require("discord.js");
const numeral = require("numeral");

const commandParser = ({ prefix, message }) => {
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  return { commandBody, args, command };
};

const parseData = ({ quoteData, overviewData }) => {
  return {
    ...parseQuoteData(quoteData),
    ...parseOverviewData(overviewData),
  };
};

const parseQuoteData = (data) => {
  return {
    high: data["Global Quote"]["03. high"],
    low: data["Global Quote"]["04. low"],
    price: data["Global Quote"]["05. price"],
    volume: data["Global Quote"]["06. volume"],
    change: data["Global Quote"]["09. change"],
    changePercent: data["Global Quote"]["10. change percent"],
  };
};

const parseOverviewData = (data) => {
  return {
    name: data.Name,
    symbol: data.Symbol,
    exchange: data.Exchange,
    currency: data.Currency,
    PERatio: data.PERatio,
    dividendYield: data.DividendYield,
  };
};

const embeddedMessage = ({
  name,
  symbol,
  price,
  high,
  low,
  volume,
  change,
  changePercent,
  exchange,
  currency,
  PERatio,
  dividendYield,
}) => {
  const embed = new MessageEmbed()
    .setColor("#7ED321")
    .setTitle(`${name}, ${symbol}`)
    .addFields(
      {
        name: "Price",
        value: codeBlockFormat(`${currencyFormat(price)}`),
        inline: true,
      },
      {
        name: "High",
        value: codeBlockFormat(`${currencyFormat(high)}`),
        inline: true,
      },
      {
        name: "Low",
        value: codeBlockFormat(`${currencyFormat(low)}`),
        inline: true,
      }
    )
    .addFields(
      {
        name: "Change",
        value: codeBlockFormat(`${currencyFormat(change)}`),
        inline: true,
      },
      {
        name: "Change (%)",
        value: codeBlockFormat(`${percentageFormat(changePercent)}`),
        inline: true,
      },
      {
        name: "\u200B",
        value: "\u200B",
        inline: true,
      }
    )
    .addFields(
      {
        name: "P/E Ratio",
        value: codeBlockFormat(`${decimalNumberFormat(PERatio)}`),
        inline: true,
      },
      {
        name: "Dividend Yield",
        value: codeBlockFormat(`${percentageFormat(dividendYield)}`),
        inline: true,
      },
      {
        name: "Volume",
        value: codeBlockFormat(`${wholeNumberFormat(volume)}`),
        inline: true,
      }
    )
    .addFields(
      { name: "Exchange", value: codeBlockFormat(exchange), inline: true },
      { name: "Currency", value: codeBlockFormat(currency), inline: true },
      {
        name: "\u200B",
        value: "\u200B",
        inline: true,
      }
    )
    .setTimestamp();

  return embed;
};

const currencyFormat = (val) => {
  return numeral(val).format("$0,0.00");
};

const wholeNumberFormat = (val) => {
  return numeral(val).format("0,0");
};

const decimalNumberFormat = (val) => {
  return numeral(val).format("0.00");
};

const percentageFormat = (val) => {
  return numeral(val).format("0.00%");
};

const codeBlockFormat = (str) => {
  return "`" + str + "`";
};

module.exports = {
  commandParser,
  parseData,
  embeddedMessage,
};
