const express = require('express');
const path = require('path');

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8080;


app.use(express.static(__dirname + '/assets'));

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


app.listen(port);
console.log('Server started at http://localhost:' + port);