
var citiesName = []; // this array contains the name of every city that we can currently display the weather of


/**
 * When the user clicks on a city, the page will redirect to the city page.
 * @param cityName - The name of the city you want to get the page for.
 */
function getCityPage(cityName) {
    window.location.href = `/city/${cityName}`
}


/**
 * It fetches the weather data from the OpenWeatherMap API and returns the JSON object
 * @param lat - latitude
 * @param lon - longitude
 * @returns The weather data for the current location.
 */
 async function getWeather(lat, lon) {
    let response = await fetch(`/weather_info/?lat=${lat}&lon=${lon}`,{method:"GET"});
    let jsonObj = await response.json();
    return jsonObj;
}


/**
 * It takes a city name as a parameter, and returns a JSON object containing information about that
 * city
 * @param cityName - The name of the city you want to get the information of.
 * @returns the information of the city.
 */
async function getInfoCity(cityName) {
    let response = await fetch(`/city_info/${cityName}`,{method:"GET"});
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

async function setWeatherForAllCities(){
    for (let cityName of citiesName) {
        await setWeatherCity(cityName) // richieste sequenziali!
    }
}
*/

/**
 * For each city name in the citiesName array, gets the weather of that specific city and then display it
 * on the page
 */
 async function setWeatherForAllCities(){
    arrayCall = []
    for (let cityName of citiesName) {
        arrayCall.push(setWeatherCity(cityName))
    }
    await Promise.all(arrayCall) // in tal modo le richieste verranno eseguite come concorrenziali
}


document.addEventListener('DOMContentLoaded', function() {
    let weatherButtonCities = document.getElementsByClassName("what-weather-in-city")
    for (let i = 0; i < weatherButtonCities.length; i++) {
        if (weatherButtonCities[i].id == "") continue;
        citiesName.push(weatherButtonCities[i].id.split("-")[3]); // prendiamo solamente il nome della città e non 'what-weather-in', quello non ci serve
        weatherButtonCities[i].addEventListener('click', async () => {
            getCityPage(weatherButtonCities[i].id.split("-")[3])
        })
    }
    document.getElementById("weather-all").addEventListener('click', async () => {
        await setWeatherForAllCities();
    });
    (async () => {await setWeatherForAllCities()})()
    window.setInterval(async () => {await setWeatherForAllCities()}, (1000 * 60))
});

