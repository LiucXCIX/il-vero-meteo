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
    const ImageLoaderWorker = new Worker('../js/image_worker.js')
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

function handleMap(lat, lon, cityName, countryName, weatherDescription, weatherIconId, temp) {
    var map = L.map('map').setView([lat , lon], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    var marker = L.marker([lat , lon]).addTo(map);
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
    let cityName = document.getElementById("city-name").innerText
    let position = await getInfoCity(cityName)
    if (position[0] == undefined) {
        alert(`Non è stato possibile ottenere il meteo per la città chiamata ${cityName}, verrai quindi riportato sulla homepage`)
        window.location.href = `/`
    }
    // get l'array in localstorge se è undefined inseriscine uno nuovo, se no vai a appendere il cityName nuovo alla lista
    localStorage.setItem("ilverometeoRequestedCities", )
    let weatherCity = await getWeather(position[0].lat, position[0].lon);
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
    handleMap(position[0].lat, position[0].lon, weatherCity.name, weatherCity.sys.country, weatherCity.weather[0].description, weatherCity.weather[0].id, weatherCity.main.feels_like)
})