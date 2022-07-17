
var citiesName = []; // this array contains the name of every city that we can currently display the weather of

/**
 * CAUTION: The API Key is visible right now, it should be put elsewhere.
 * ---
 * It fetches the weather data from the OpenWeatherMap API and returns the JSON object
 * @param lat - latitude
 * @param lon - longitude
 * @returns The weather data for the current location.
 */
async function getWeather(lat, lon) {
    let response = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=5de7088a14f2467e0c274b6a909f15f6&units=metric",{method:"GET"});
    let jsonObj = await response.json();
    return jsonObj;
}


/**
 * CAUTION: The API Key is visible right now, it should be put elsewhere.
 * ---
 * It takes a city name as a parameter, and returns a JSON object containing information about that
 * city
 * @param cityName - The name of the city you want to get the information of.
 * @returns the information of the city.
 */
async function getInfoCity(cityName) {
    let response = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=5de7088a14f2467e0c274b6a909f15f6",{method:"GET"});
    let jsonObj = await response.json();
    return jsonObj;
}


/**
 * It takes a city name, gets the latitude and longitude of that city, then gets the weather of that
 * city and displays it on the page
 * @param cityName - The name of the city you want to get the weather for.
 */
async function setWeatherCity(cityName){
    let infoCity = await getInfoCity(cityName);
    let lat = infoCity[0].lat; 
    let lon = infoCity[0].lon;
    let weatherCity = await getWeather(lat, lon);
    document.getElementById("weather-" + cityName).classList.add("wi-owm-" + weatherCity.weather[0].id)
    document.getElementById("weather-" + cityName).innerText = " " + weatherCity.weather[0].description
    document.getElementById("temp-" + cityName).innerText = weatherCity.main.temp + "°C"
}


/**
 * For each city name in the citiesName array, gets the weather of that specific city and then display it
 * on the page
 */
async function setWeatherForAllCities(){
    for (let cityName of citiesName) {
        await setWeatherCity(cityName)
    }
}


document.addEventListener('DOMContentLoaded', function() {
    let weatherButtonCities = document.getElementsByClassName("what-weather-in-city")
    for (let i = 0; i < weatherButtonCities.length; i++) {
        if (weatherButtonCities[i].id == "") continue;
        citiesName.push(weatherButtonCities[i].id.split("-")[3]); // prendiamo solamente il nome della città e non 'what-weather-in', quello non ci serve
        weatherButtonCities[i].addEventListener('click', async () => {
            await setWeatherCity(weatherButtonCities[i].id.split("-")[3])
        })
    }
    document.getElementById("weather-all").addEventListener('click', async () => {
        await setWeatherForAllCities();
    });
    (async () => {await setWeatherForAllCities()})()
    window.setInterval(async () => {await setWeatherForAllCities()}, (1000 * 120))
});

