(function () {
    /* Variables */
    const apiKey =  "<yourApiKey>";
    let lat;
    let lng;
    let fUnit = "°F";
    let cUnit = "°C";

    const testWithApiCall = true;

    // DOM
    let locationForm = document.querySelector(".location-form");
    let locationInput = document.getElementById("locationInput");
    let temperatureSection = document.querySelector('.temperature-section');
    let weatherDescription = document.querySelector('.weather-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let temperatureUnit = document.querySelector('.temperature-unit')
    let iconImg = document.querySelector('.weather-icon');


    /* Methods */
    const kelvinToCelsius = (temp) => {
        return roundToTenth(temp - 273.15);
    };
    
    const fahrenheitToCelsius = (temp) => {
        return roundToTenth((temp - 32) * (5/9));
    }
    
    const celsiusToFahrenheit = (temp) => {
        return roundToTenth((temp * (9/5)) + 32);
    }

    const roundToTenth = (value) => {
        return Math.round(10 * value) / 10;
    }
    
    const weatherIconUrl = (id) => {
        return `https://openweathermap.com/img/wn/${id}.png`;
    }

    const searchLocation = (event) => {
        event.preventDefault();

        if (locationInput.value.search("^[0-9]+$") > 0) {
            renderWeatherInfo(`https://api.openweathermap.org/data/2.5/weather?zip=${locationInput.value}&appid=${apiKey}`);
        } else {
            renderWeatherInfo(`https://api.openweathermap.org/data/2.5/weather?q=${locationInput.value}&appid=${apiKey}`);
        }
    }

    const renderWeatherInfo = (api) => {
        
        if (testWithApiCall) {
            fetch(api)
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    const {name} = data;
                    const {description, icon} = data.weather[0];
                    const {temp} = data.main;

                    locationInput.value = name;
                    temperatureDegree.textContent = celsiusToFahrenheit(kelvinToCelsius(temp));
                    temperatureUnit.textContent = fUnit;
                    weatherDescription.textContent = description;
                    iconImg.src = weatherIconUrl(icon);
                })
            }
    }

    const renderUserWeatherInfo = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( position => {
                lng = position.coords.longitude;
                lat = position.coords.latitude;
                const latLngApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
                renderWeatherInfo(latLngApi);
            })
            
        }
    }

    const toggleUnits = () => {
        if (temperatureUnit.textContent === fUnit) {
            temperatureUnit.textContent = cUnit;
            temperatureDegree.textContent = fahrenheitToCelsius(temperatureDegree.textContent);
        } else {
            temperatureUnit.textContent = fUnit;
            temperatureDegree.textContent = celsiusToFahrenheit(temperatureDegree.textContent);
        }
    }

    /* Event Listeners */
    window.addEventListener('load', renderUserWeatherInfo);
    temperatureSection.addEventListener('click', toggleUnits);
    locationForm.addEventListener('submit', searchLocation);
})();