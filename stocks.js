const unirest = require('unirest');


var getStocks = (callback) => {

    var output = "";
    unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-summary?region=US&lang=en")
.header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
.header("X-RapidAPI-Key", "cb9eca60abmsh7f5112874cf855dp1a234bjsn0b7579ec04e1")
.end(function (result) {
    var json = result.body;
    if (result.statusCode === 403) {
        callback(JSON.parse('{"error": "Unable to connect to Forecast.io server."}'), null);
      } else if (result.statusCode === 400) {
        callback('Unable to fetch stocks.', null);
      } else if (result.statusCode === 200) {
        var i=0;
        while (i < 3) {
            if(json.marketSummaryResponse.result[i] != null){
                output+=json.marketSummaryResponse.result[i].fullExchangeName + ' : ' + json.marketSummaryResponse.result[0].regularMarketPrice.raw +"  ";        
                break;
            }
            i++;
            }   
            console.log(output);
        callback(undefined, {
            stocklist: output
        });
      }   
   
    
});



};
var getStockbySymbol = (sym,callback) => {
  console.log(sym);
  var output = "";
  unirest.get(`https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-quotes?region=US&lang=en&symbols=${sym}`)
.header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
.header("X-RapidAPI-Key", "cb9eca60abmsh7f5112874cf855dp1a234bjsn0b7579ec04e1")
.end(function (result) {
  console.log(result.status, result.headers, result.body);

  var json = result.body;
  if (result.statusCode === 403) {
      callback(JSON.parse('{"error": "Unable to connect to Forecast.io server."}'), null);
    } else if (result.statusCode === 400) {
      callback('Unable to fetch stocks.', null);
    } else if (result.statusCode === 200) {
      console.log(JSON.stringify(result.body));
      callback(undefined, {
          exchangename: json.quoteResponse.result[0].symbol,
          marketprice: json.quoteResponse.result[0].regularMarketPrice
          //symbol: son.marketSummaryResponse.result[0].regularMarketPrice.raw
          //symbol: outpjson.marketSummaryResponse.result[i].fullExchangeNamet
      });
    }   
 
  
});



};




module.exports.getStocks = getStocks;
module.exports.getStockbySymbol = getStockbySymbol;