const loader = document.querySelector(".imgLoader");
const erreurConnexion = document.querySelector(".erreurConnexion");

async function weatherData(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d84cd3b4d798b75097ed3e8ba986800c&units=metric&lang=fr`);
        
        if (!response.ok) {
            throw new Error('Erreur réseau lors de la requête.');
        }
        // https://api.openweathermap.org/data/2.5/forecast?lat=44.34&lon=10.99&appid=d84cd3b4d798b75097ed3e8ba986800c&units=metric&lang=fr
        const responseData = await response.json();

        const city = responseData.name;
        const temperature = Math.round(responseData.main.temp);
        const country = responseData.sys.country;
        const icon = responseData.weather[0].icon;
        const humidity = responseData.main.humidity; 
        const windSpeed = responseData.wind.speed; 

        const cityElement = document.querySelector(".city");
        const countryElement = document.querySelector(".country");
        const temperatureElement = document.querySelector(".temperature");
        const iconElement = document.querySelector(".imgInfo");
        const humidityElement = document.querySelector(".humidity"); 
        const windSpeedElement = document.querySelector(".windSpeed"); 

        cityElement.textContent = city;
        countryElement.textContent = country;
        temperatureElement.textContent = `${temperature}°C`;
        iconElement.src = `ressources/jour/${icon}.svg`;
        iconElement.alt = responseData.weather[0].description;
        iconElement.style.width = "180px"; 
        humidityElement.textContent = `Humidité: ${humidity}%`;
        windSpeedElement.textContent = `Vitesse du vent: ${windSpeed} m/s`;
        loader.classList.remove("active");

    } catch (error) {
        console.error("Erreur lors de la récupération de la météo :", error);
        loader.classList.remove("active");
        erreurConnexion.textContent = "Erreur de réseau";
    }
}

function coordonnesGeo() {
    if (!navigator.geolocation) {
        console.error("Géolocalisation non supportée par ce navigateur.");
        return;
    }

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        weatherData(latitude, longitude);
    }

    function error(err) {
        switch (err.code) {
            case err.PERMISSION_DENIED:
                console.error("L'utilisateur a refusé l'accès à sa position.");
                break;
            case err.POSITION_UNAVAILABLE:
                console.error("La position de l'utilisateur n'a pas pu être déterminée.");
                break;
            case err.TIMEOUT:
                console.error("La demande pour obtenir la position de l'utilisateur a expiré.");
                break;
            case err.UNKNOWN_ERROR:
                console.error("Une erreur inconnue est survenue.");
                break;
        }
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

coordonnesGeo();
