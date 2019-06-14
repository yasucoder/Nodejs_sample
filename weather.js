const request = require('request');

var getWeather = (lat, lng, callback) => {
  console.log('${lat} +":"+${lng}');
  request({
    //url: 'https://api.darksky.net/forecast/b79639ed69e8d45232341a1d883ae87d/${lat},${lng}',
    url: `https://api.darksky.net/forecast/b79639ed69e8d45232341a1d883ae87d/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
    console.log(response.statusCode);
    console.log(error);
    if (response.statusCode === 403) {
      callback(JSON.parse('{"error": "Unable to connect to Forecast.io server."}'), null);
    } else if (response.statusCode === 400) {
      callback('Unable to fetch weather.', null);
    } else if (response.statusCode === 200) {
      callback(undefined, {
        temperature: body.currently.temperature,
        apparentTemperature: body.currently.apparentTemperature
      });
    }
  });
};

module.exports.getWeather = getWeather;
