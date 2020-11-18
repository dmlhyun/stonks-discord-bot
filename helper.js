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
    open: data["Global Quote"]["02. open"],
    price: data["Global Quote"]["05. price"],
    change: data["Global Quote"]["09. change"],
    changePercent: data["Global Quote"]["10. change percent"],
  };
};

const parseOverviewData = (data) => {
  return {
    symbol: data.Symbol,
    exchange: data.Exchange,
    currency: data.Currency,
    PERatio: data.PERatio,
    dividendYield: data.DividendYield,
  };
};

module.exports = {
  commandParser,
  parseData,
};
