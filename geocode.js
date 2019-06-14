const request = require('request');

var geocodeAddress = (address, callback) => {
  var encodedAddress = encodeURIComponent(address);

  request({
    url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyB0_NnKGFMhO_GFo2QlL0eu9GyV0H93TJE`,
    json: true
  }, (error, response, body) => {
    console.log(response.statusCode);
    console.log(body.status);
    if(body.status === 'REQUEST_DENIED') {
      console.log('I m here');
      callback(JSON.parse('{"error": "Unable to connect to Google servers."}'), null);
    } else if (body.status === 'ZERO_RESULTS') {
      callback(JSON.parse('{"error": "Unable to find that address."}'), null);
    } else if (body.status === 'OK') {
      callback(undefined, {
        address: body.results[0].formatted_address,
        latitude: body.results[0].geometry.location.lat,
        longitude: body.results[0].geometry.location.lng
      });
    }
  });
};

module.exports.geocodeAddress = geocodeAddress;
