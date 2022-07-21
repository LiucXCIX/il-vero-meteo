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


document.addEventListener('DOMContentLoaded', async function() {
    position = sessionStorage.getItem("user_locationilverometeo.it")
    if (position == null) {
        alert("Non è stato possibile ottenere la tua posizione, verrai riportato sulla homepage")
        window.location.href = `/`
    }
    position = JSON.parse(position)
    let weatherCity = await getWeather(position.lat, position.lon);
    handleMap(position.lat, position.lon, weatherCity.name, weatherCity.sys.country, weatherCity.weather[0].description, weatherCity.weather[0].id, weatherCity.main.feels_like)
})