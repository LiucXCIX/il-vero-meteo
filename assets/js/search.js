function getCityPage(cityName) {
    window.location.href = `/city/${cityName}`
}

document.addEventListener('DOMContentLoaded', function() {
    search = document.getElementById("search-city")
    search_button = document.getElementById("search-button")
    search.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            // console.log(search.value)
            getCityPage(search.value)
            // search_button.click()
        }
    })
    search_button.addEventListener('click', function() {
        getCityPage(search.value)
    })
})