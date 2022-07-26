function getCityPage(cityName) {
    window.location.href = `/city/${cityName}`
}

function getCityPageByCoords(position) {
    console.log({position})
    let location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user_locationilverometeo.it", JSON.stringify(location))
    window.location.href = `/city`
}

function getMapPageByCoords(position) {
    console.log({position})
    let location = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    };
    sessionStorage.setItem("user_locationilverometeo.it", JSON.stringify(location))
    window.location.href = `/map`
}

/**
 * If the user denies the request for geolocation, or if the request fails for any reason, the function
 * will display an alert box with a message explaining what went wrong
 * @param error - The error object returned by the geolocation API.
 */
function showErrorMap(error) {
    let pos = {
        coords: {
            latitude: 41.8902,
            longitude: 12.4922,
        }
    }
    alert("Non è stato possibile rivelare la tua posizione. Beccati 'sto Colosseo in faccia, tiè!")
    getMapPageByCoords(pos)
}

/**
 * If the user denies the request for geolocation, or if the request fails for any reason, the function
 * will display an alert box with a message explaining what went wrong
 * @param error - The error object returned by the geolocation API.
 */
 function showErrorCity(error) {
    let pos = {
        coords: {
            latitude: 41.8902,
            longitude: 12.4922,
        }
    }
    alert("Non è stato possibile rivelare la tua posizione. Beccati 'sto Colosseo in faccia, tiè!")
    getCityPageByCoords(pos)
}

/**
 * If the browser supports geolocation, get the current position and call the getCityPageByCoords
 * function, otherwise show an error message
 */
function getCurrentLocation() {
    if (sessionStorage.getItem("user_locationilverometeo.it") == null){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getCityPageByCoords, showErrorCity);
        } else {
            alert("La geolocalizzazione non è supportata da questo browser.");
        }
    } else {
        window.location.href = `/city`
    }
}

/**
 * If the browser supports geolocation, get the current position and call the getCityPageByCoords
 * function, otherwise show an error message
 */
 function getCurrentMapLocation() {
    if (sessionStorage.getItem("user_locationilverometeo.it") == null){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getMapPageByCoords, showErrorMap);
        } else {
            alert("La geolocalizzazione non è supportata da questo browser.");
        }
    } else {
        window.location.href = `/map`
    }
}

document.addEventListener('DOMContentLoaded', function() {
    search = document.getElementById("search-city")
    search_button = document.getElementById("search-button")
    cityButton = document.getElementsByClassName("your-city")
    mapButton = document.getElementsByClassName("map")
    search.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            getCityPage(search.value)
        }
    })
    search_button.addEventListener('click', function() {
        getCityPage(search.value)
    })
    for (let btt of cityButton){
        btt.addEventListener('click', function() {
            getCurrentLocation()
        })
    }
    for (let btt of mapButton){
        btt.addEventListener('click', function() {
            getCurrentMapLocation()
        })
    }
})