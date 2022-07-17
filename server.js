const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston');
const path = require('path');
const axios = require('axios');
const favicon = require('serve-favicon');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
const weather_api_key = process.env.WEATHER_API_KEY

app.use(favicon(path.join(__dirname, 'assets', 'img', 'Favicon', 'il-vero-meteo.ico')));
app.use(express.static(__dirname + '/assets'));

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

app.get('/city', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/city.html'));
});

app.get('/city/:city_name', function (req, res) {
    console.log(req.params.city_name, __dirname)
    res.sendFile(path.join(__dirname, '/views/city.html'));
});

app.get('/cities', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/cities.html'));
});

app.get('/city_info/:city_name', function (req, res) {
    let fullUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${req.params.city_name}&appid=${weather_api_key}`;
    axios.get(fullUrl)
    .then(json => {
        res.json(json.data)
    })
    .catch(error => {
        return res.status(500).json(error);
    })
});

app.get('/weather_info', function (req, res) {
    let fullUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${req.query.lat}&lon=${req.query.lon}&appid=${weather_api_key}&units=metric`;
    axios.get(fullUrl)
    .then(json => {
        res.json(json.data)
    })
    .catch(error => {
        return res.status(500).json(error);
    })
});

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

app.listen(port);
console.log('Server started at http://localhost:' + port);
