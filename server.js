const express = require('express');
const axios = require('axios');
const { initialize, isEnabled } = require('unleash-client');
const PORT = 8100;
const app = express();

// Middleware to set Access-Control-Allow-Origin header
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// First step, get lat and lon of a place
const URI_LOCATION = "https://nominatim.openstreetmap.org/search"; // Params: q=place&format=json (returns array of objects, get the first one)

// Second step, get weather of a place (hourly and daily)
const URI_WEATHER = "https://api.open-meteo.com/v1/forecast"; // Params: latitude, longitude, forecast_days  (if daily param), daily|hourly, timezone

// Third step, get restaurants near the place (+- 0.01 lat and lon)
const URI_NEAR = "https://api.openstreetmap.org/api/0.6/map"; // Params: bbox (min_lon, min_lat, max_lon, max_lat), returns xml (osm)

const URI_GEOCODING = "https://geocoding-api.open-meteo.com/v1/search?";
// Unleash configuration
const unleashConfig = {
  appName: 'task',
  url: 'http://localhost:4242/api/',
  customHeaders: {
    Authorization : '*:development.3dd388362c9ddf9a13ae5353ee646ea1c42da802317b33fa2b8409c5'
  }
};

initialize(unleashConfig);

// Feature toggle function
function isFeatureEnabled(featureName) {
    // console.log("Llamado a la funcion");
   return isEnabled(featureName, {});
}



app.get('/weather/:place', async (req, res) => {
    try {
        const place = req.params.place;
        console.log(place);
        if (isFeatureEnabled('task')){
            console.log("Aqui");
            const response = await axios.get(URI_GEOCODING + `name=${place}`);
            res.send({"SEGUNDA API" : "GEOCODING","response": response.data});
            console.log(response.data.results);
        }else
        {
            const locationParams = {
                q: place,
                format: 'json'
            };
            const locationResponse = await axios.get(URI_LOCATION, { params: locationParams });
            const { lat, lon } = locationResponse.data[0];
            const weatherParams = {
                latitude: lat,
                longitude: lon,
                daily: 'temperature_2m_max',
                forecast_days: 3,
                timezone: 'PST'
            };
            const weatherResponse = await axios.get(URI_WEATHER, { params: weatherParams });
            const nearbyParams = {
                bbox: `${lon - 0.01},${lat - 0.01},${lon + 0.01},${lat + 0.01}`
            };
            const nearbyResponse = await axios.get(URI_NEAR, { params: nearbyParams });
            const restaurants = nearbyResponse.data.elements
                .filter(element => element.tags && element.tags.amenity === 'restaurant')
                .map(element => ({
                    name: element.tags.name,
                    location: {
                        latitude: element.lat,
                        longitude: element.lon
                    }
                }));
            res.json({
                PrimeraAPI : "PRIMERA API",
                weather: weatherResponse.data,
                nearby: restaurants
            });
            console.log(`Weather and nearby restaurants for ${place} sent`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
