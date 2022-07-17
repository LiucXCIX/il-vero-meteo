/**
 * It removes the dark mode class from the body tag and adds the light mode class to the body tag
 */
function switchLightMode() {
    let body = document.getElementsByTagName("body")
    body[0].classList.remove("bootstrap-dark")
    body[0].classList.add("bootstrap")
    let preference = {
        darkMode: false,
        date: new Date().getTime(),
    };
    localStorage.removeItem("settingsilverometeo.it")
    localStorage.setItem("settingsilverometeo.it", JSON.stringify(preference))
}

/**
 * It removes the light mode class from the body tag and adds the dark mode class to it
 */
function switchDarkMode() {
    let body = document.getElementsByTagName("body")
    body[0].classList.remove("bootstrap")
    body[0].classList.add("bootstrap-dark")
    let preference = {
        darkMode: true,
        date: new Date().getTime(),
    };
    localStorage.removeItem("settingsilverometeo.it")
    localStorage.setItem("settingsilverometeo.it", JSON.stringify(preference))
}

document.addEventListener('DOMContentLoaded', (e) => {
    let previousSettingsJson = localStorage.getItem("settingsilverometeo.it");
    let previousSettings = null;
    if (previousSettingsJson != null) {
        let currentDate = new Date().getTime();
        previousSettings = JSON.parse(previousSettingsJson);
        const thirthyDaysInMilliseconds = 30 * 24 * 60 * 60 * 1000; 
        if (currentDate - previousSettings['date'] > thirthyDaysInMilliseconds) {
            localStorage.removeItem("settingsilverometeo.it");
            previousSettings = null;
        }
    }

    if (previousSettings != null) {
        if (previousSettings['darkMode']){
            switchDarkMode()
            document.getElementById("turnOnOffDarkMode").classList.add("active")
        }
    }

    document.getElementById("turnOnOffDarkMode").addEventListener('click', function() {
        let body = document.getElementsByTagName("body")
        if (body[0].classList.contains("bootstrap")) {
            switchDarkMode()
            document.getElementById("turnOnOffDarkMode").classList.add("active")
        } else {
            switchLightMode()
            document.getElementById("turnOnOffDarkMode").classList.remove("active")
        }
    })
});