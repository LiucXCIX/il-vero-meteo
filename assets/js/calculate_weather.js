
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


function getImages() {
    const ImageLoaderWorker = new Worker('js/image_worker.js')
    const imgElements = document.querySelectorAll('img[data-src]')

    ImageLoaderWorker.addEventListener('message', event => {
        const imageData = event.data
        const imageElement = document.querySelector(`img[data-src='${imageData.imageURL}']`)
        const objectURL = imageData.res.urls.regular       
        imageElement.setAttribute('src', objectURL)
        imageElement.removeAttribute('data-src')
    })
    
    imgElements.forEach(imageElement => {
        const imageURL = imageElement.getAttribute('data-src')
        ImageLoaderWorker.postMessage(imageURL)
    })
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


function createCardsForCities(listSearchedCities) {
    let cardToSet = document.getElementsByClassName("card-city-unset")
    for (let i = 0; i < listSearchedCities.length && i < cardToSet.length; i++) {
        let card = cardToSet[i]
        let cityName = listSearchedCities[i]
        console.log({card})
        card.classList.add("card-city-set")
        card.getElementsByTagName('img')[0].setAttribute("data-src", `/city_photo/${cityName}`)
        card.getElementsByTagName('img')[0].setAttribute("alt", `Foto scattata a ${cityName}`)
        card.getElementsByClassName('description-city')[0].innerText = `${cityName}`
        card.getElementsByClassName('what-weather-in-city')[0].setAttribute('id', `what-weather-in-${cityName}`)
        card.getElementsByClassName('weather-city')[0].setAttribute('id', `weather-${cityName}`)
        card.getElementsByClassName('temp-city')[0].setAttribute('id', `temp-${cityName}`)
    }
}


function removeUnsetCardCities(){
    let cardsToRemove = document.getElementsByClassName("col")
    for (let i = cardsToRemove.length - 1; i >= 0; i--) {
        if (!cardsToRemove[i].children[0].classList.contains("card-city-set")) {
            cardsToRemove[i].remove()
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    let prevSearchedCities = localStorage.getItem("ilverometeoSearchedCities")
    if (prevSearchedCities != null) {
        let listSearchedCities = JSON.parse(prevSearchedCities)
        createCardsForCities(listSearchedCities)
    }
    removeUnsetCardCities()
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
    getImages()
    window.setInterval(async () => {await setWeatherForAllCities()}, (1000 * 60))
});

