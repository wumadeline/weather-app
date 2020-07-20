(function () {

    /* Variables */

    // CONSTANTS
    const apiKey =  "66dbd3dd9ecc4d8eaf3dd313bb1909f1";
    const fUnit = "°F";
    const cUnit = "°C";
    const testWithApiCall = true;

    // STATE VARIABLES
    let prevInput;
    let inputKeyPressed = false;

    // DOM
    let locationForm = document.querySelector(".location-form");
    let locationInput = document.getElementById("locationInput");
    let temperatureSection = document.querySelector('.temperature-section');
    let weatherDiv = document.querySelector('.weather');
    let weatherDescription = document.querySelector('.weather-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let temperatureUnit = document.querySelector('.temperature-unit')
    let iconImg = document.querySelector('.weather-icon');


    /* Methods */
    // HELPER METHODS
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

    // CALLBACK FUNCTIONS
    /**
     * This function handles the input value when it loses focus.
     * If the user has not modified the input, it loads the previous value (no change).
     */
    const inputBlurHandler = () => {
        if (!locationInput.value  && !inputKeyPressed) {
            locationInput.value = prevInput;
            prevInput = null;;
        }

        inputKeyPressed = false;
    }

   /**
    * This function clears the input when it is in focus.
    * It saves the previous input value in case the user does not modify the input before unfocusing.
    */
    const inputFocusHandler = () => {
        if (!inputKeyPressed) {
            prevInput = locationInput.value;
            locationInput.value = null;
        }
    }

    const inputKeydownHandler = (event) => {
        inputKeyPressed = true;

        // Clear weather data
        weatherDiv.style.display = "none";
    }

    const searchLocation = (event) => {
        event.preventDefault();

        try {
            if (locationInput.value.search("^[0-9]+$") > 0) {
                renderWeatherInfo(`https://api.openweathermap.org/data/2.5/weather?zip=${locationInput.value}&appid=${apiKey}`);
            } else {
                renderWeatherInfo(`https://api.openweathermap.org/data/2.5/weather?q=${locationInput.value}&appid=${apiKey}`);
            }
        } catch {
            alert("no matching location found");
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

                    weatherDiv.style.display = "flex";

                    locationInput.value = name;
                    temperatureDegree.textContent = celsiusToFahrenheit(kelvinToCelsius(temp));
                    temperatureUnit.textContent = fUnit;
                    weatherDescription.textContent = description;
                    iconImg.src = weatherIconUrl(icon);

                    locationInput.blur();
                })
        }
    }

    const renderUserWeatherInfo = () => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition( position => {
                const lng = position.coords.longitude;
                const lat = position.coords.latitude;
                const latLngApi = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
                renderWeatherInfo(latLngApi);
            })
            
        }
        iconImg.style.display = "flex";

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
    locationInput.addEventListener('focus', inputFocusHandler);
    locationInput.addEventListener('blur', inputBlurHandler);
    locationInput.addEventListener('keydown', inputKeydownHandler);
})();