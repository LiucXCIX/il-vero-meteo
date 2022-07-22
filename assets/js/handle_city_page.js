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

function getImages() {
    const ImageLoaderWorker = new Worker('js/image_worker.js')
    const imgElements = document.querySelectorAll('img[data-src]')

    ImageLoaderWorker.addEventListener('message', event => {
        const imageData = event.data
        const imageElement = document.querySelector(`img[data-src='${imageData.imageURL}']`)
        const objectURL = imageData.res.urls.small // successivamente metterei regular
        imageElement.setAttribute('src', objectURL)
        imageElement.removeAttribute('data-src')
    })
    
    imgElements.forEach(imageElement => {
        const imageURL = imageElement.getAttribute('data-src')
        ImageLoaderWorker.postMessage(imageURL)
    })
}

/**
 * It creates a map, adds a marker to it, and adds a click listener to the map that displays a popup
 * with the weather data of the clicked location
 * @param lat - latitude
 * @param lon - longitude
 * @param cityName - The name of the city
 * @param countryName - The name of the country
 * @param weatherDescription - The weather description, e.g. "clear sky"
 * @param weatherIconId - The weather icon ID from the OpenWeatherMap API.
 * @param temp - temperature in Celsius
 */
function handleMap(cityName, countryName, weatherDescription, weatherIconId, temp) {
    var map = L.map('map').setView([position.lat , position.lon], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    var marker = L.marker([position.lat , position.lon]).addTo(map);
    marker.bindPopup(`<b class = "text-primary">${cityName} (${countryName})</b><span> ${weatherDescription} <i class = "wi wi-owm-${weatherIconId}"> </i> ${temp}°C</span>`).openPopup();
    // map.addEventListener('click', function(event) {onMapClick(event)});
    async function onMapClick(e) {
        let weatherCity = await getWeather(e.latlng.lat, e.latlng.lng);
 	    L.popup()
 	    	.setLatLng(e.latlng)
 	    	.setContent(`<a class = "link-primary" href = "/city/${weatherCity.name}">${weatherCity.name} (${weatherCity.sys.country})</a><span> ${weatherCity.weather[0].description} <i class = "wi wi-owm-${weatherCity.weather[0].id}"> </i> ${weatherCity.main.feels_like}°C</span><br>`)
 	    	.openOn(map);
    }
    map.on('click', async function(event) {onMapClick(event)});
}

/**
 * It converts seconds to hours, minutes, and seconds.
 * @param sec_num - The number of seconds to convert to HH:MM:SS format.
 * @returns the hours, minutes, and seconds of the time.
 */
function toHHMMSS(sec_num) {
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    hours = hours % 24
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

document.addEventListener('DOMContentLoaded', async function() {
    position = sessionStorage.getItem("user_locationilverometeo.it")
    if (position == null) {
        alert("Non è stato possibile ottenere la tua posizione, verrai riportato sulla homepage")
        window.location.href = `/`
    }
    position = JSON.parse(position)
    let weatherCity = await getWeather(position.lat, position.lon);
    document.getElementById("city-name").innerText = weatherCity.name
    document.getElementById("country").innerText = weatherCity.sys.country
    document.getElementById("time").innerText = toHHMMSS(weatherCity.dt + weatherCity.timezone)
    document.getElementById("weather-info").innerText = " " + weatherCity.weather[0].description + " "
    document.getElementById("weather-icon").classList.add("wi-owm-" + weatherCity.weather[0].id)
    document.getElementById("temp").innerText = weatherCity.main.temp
    document.getElementById("actual-temp").innerText = weatherCity.main.feels_like
    document.getElementById("min-temp").innerText = weatherCity.main.temp_min
    document.getElementById("max-temp").innerText = weatherCity.main.temp_max
    document.getElementById("press").innerText = weatherCity.main.pressure
    document.getElementById("hum").innerText = weatherCity.main.humidity
    document.getElementById("vis").innerText = weatherCity.visibility
    document.getElementById("wind").innerText = weatherCity.wind.speed
    document.getElementById("sunrise").innerText = toHHMMSS(weatherCity.sys.sunrise + weatherCity.timezone)
    document.getElementById("sunset").innerText = toHHMMSS(weatherCity.sys.sunset+ weatherCity.timezone)
    document.getElementById("city-img").setAttribute("data-src", `/city_photo/${weatherCity.name}`);
    getImages()
    handleMap(weatherCity.name, weatherCity.sys.country, weatherCity.weather[0].description, weatherCity.weather[0].id, weatherCity.main.feels_like)
})