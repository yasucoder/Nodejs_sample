var express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const geocode = require('./geocode');
const weather = require('./weather');
const stock = require('./stocks');

var unirest = require('unirest');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
//res.send('<h1>App is UP</h1>');
res.render('home.hbs', {
    pageTitle: 'Home'
})
});

app.get('/about.html', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About'
    })
});

app.post('/weather.html', (req, res) => {
    console.log(req.body);
    var addJson = req.body;
    setTimeout(function() {
        geocode.geocodeAddress(addJson.address, (errorMessage, results) => {
            if (errorMessage) {
                res.render('error.hbs', errorMessage);
            } else {
                console.log(results.address);
                weather.getWeather(results.latitude, results.longitude, (errorMessage, weatherResults) => {
                    if (errorMessage) {
                        res.render('error.hbs', errorMessage);
                    } else {
                        res.render('weather.hbs', weatherResults)
                        console.log(`It's currently ${weatherResults.temperature}. It feels like ${weatherResults.apparentTemperature}.`);
                    }
                });
            }
        });
    }, 1000);
});

app.post('/stocks.html', (req, res) => {
    var addJson = req.body;
    console.log(addJson);
    setTimeout(function() {
    stock.getStockbySymbol(addJson.symbol,(errorMessage,stockResults) => {
        if (errorMessage) {
            res.render('error.hbs', errorMessage);
        } else {
            res.render('stocks.hbs', stockResults)
            console.log(`current Stock details: ${stockResults.exchangename}.`);
        }
    });
},1000);

});

app.get('/stock',(res,req) => {

    var resultJson = null;
    unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-summary?region=US&lang=en")
.header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
.header("X-RapidAPI-Key", "cb9eca60abmsh7f5112874cf855dp1a234bjsn0b7579ec04e1")
.end(function (result) {
  //console.log(result.status, result.headers, result.body);
  //console.log("testing");
   // console.log(JSON.stringify(result.body));
  
   var json = result.body;
    console.log(json.marketSummaryResponse.result[0].fullExchangeName);
    console.log(json.marketSummaryResponse.result[0].regularMarketPrice.raw);
    
});



});

app.listen(4200, function () {
console.log('Example app listening on port 4200!');
});