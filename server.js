const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston');
const path = require('path');
const axios = require('axios');
const favicon = require('serve-favicon');
const compression = require('compression')

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;
const weather_api_key = process.env.WEATHER_API_KEY
const unsplash_access_key = process.env.UNSPLASH_ACCESS_KEY

app.use(compression())
app.use(favicon(path.join(__dirname, 'assets', 'img', 'Favicon', 'il-vero-meteo.ico')));
app.use(express.static(__dirname + '/assets'));
app.set("view engine", "ejs");

app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}));

// MAIN ROUTES

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
    res.render("templates/city", {
        city_name: req.params.city_name.charAt(0).toUpperCase() + req.params.city_name.slice(1),
    })
});

app.get('/cities', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/cities.html'));
});

app.get('/map', function (req, res) {
    res.sendFile(path.join(__dirname, '/views/map.html'));
});

// API ROUTES

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

app.get('/city_photo/:city_name', function (req, res) {
    let fullUrl = `https://api.unsplash.com/photos/random/?client_id=${unsplash_access_key}&query=${req.params.city_name}&orientation=landscape`;
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
