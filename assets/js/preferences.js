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
    let body = document.getElementsByTagName("body")
    if (body[0].classList.contains("bootstrap-dark")) {
        var head = document.getElementsByTagName('HEAD')[0];
        // Create new link Element
        var link = document.createElement('link');
        // set the attributes for link element
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/toggle-bootstrap-dark.min.css';
        head.appendChild(link);
        link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/toggle-bootstrap-print.min.css';
        head.appendChild(link);
    }
    document.getElementById("turnOnOffDarkMode").addEventListener('click', function() {
        let body = document.getElementsByTagName("body")
        if (body[0].classList.contains("bootstrap")) {
            // Get HTML head element
            var head = document.getElementsByTagName('HEAD')[0];
            // Create new link Element
            var link = document.createElement('link');
            // set the attributes for link element
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/toggle-bootstrap-dark.min.css';
            head.appendChild(link);
            link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/toggle-bootstrap-print.min.css';
            head.appendChild(link);
            switchDarkMode()
            document.getElementById("turnOnOffDarkMode").classList.add("active")
        } else {
            switchLightMode()
            document.getElementById("turnOnOffDarkMode").classList.remove("active")
        }
    })
});