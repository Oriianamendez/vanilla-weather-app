function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hour}:${minutes}`;
}

function displayTemperature(response) {
  celsiusTemperature = response.data.temperature.current;

  let currentTemperature = document.querySelector("#temperature-number");
  currentTemperature.innerHTML = Math.round(celsiusTemperature);
  let currentCity = document.querySelector("#city");
  currentCity.innerHTML = response.data.city;
  let feelsLike = document.querySelector("#sensation");
  feelsLike.innerHTML = `Feels like ${Math.round(
    response.data.temperature.feels_like
  )}°C`;
  let currentHumidity = document.querySelector("#humidity");
  currentHumidity.innerHTML = `Humidity: ${response.data.temperature.humidity}%`;
  let currentWindSpeed = document.querySelector("#wind");
  currentWindSpeed.innerHTML = `Wind: ${Math.round(
    response.data.wind.speed
  )} m/s`;
  let currentCondition = document.querySelector("#condition");
  currentCondition.innerHTML = response.data.condition.description;
  let currentDate = document.querySelector("#date-and-hour");
  currentDate.innerHTML = formatDate(response.data.time * 1000);
  let currentIcon = document.querySelector("#icon");
  currentIcon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  currentIcon.setAttribute("alt", response.data.condition.description);

  forecastCity = response.data.city;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${forecastCity}&key=${apiKey}`;
  axios.get(apiUrl).then(displayForecast);
}

function search(city) {
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&unit={metric}`;

  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();

  let currentCityInput = document.querySelector("#city-input");
  search(currentCityInput.value);
}

function actualPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let latitudeLongitudePositionUrl = `https://api.shecodes.io/weather/v1/current?lon=${longitude}&lat=${latitude}&key=${apiKey}&units=metric`;
  axios.get(latitudeLongitudePositionUrl).then(displayTemperature);
}
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(actualPosition);
}

function formatDayForecast(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let day = days[date.getDay()];

  return day;
}

function displayForecast(response) {
  forecastDay = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecastDay.forEach(function (forecastDaily, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
    <div class="col-2">
      <div class="forecast-date">${formatDayForecast(forecastDaily.time)}</div>
      <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
        forecastDaily.condition.icon
      }.png" alt="Weather icon" class="extra-icon">
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperatures-max">${Math.round(
          forecastDaily.temperature.maximum
        )}°</span>
        <span class="weather-forecast-temperatures-min">${Math.round(
          forecastDaily.temperature.minimum
        )}°</span>
      </div>
    </div>
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let currentLocationButton = document.querySelector("#current-location");
currentLocationButton.addEventListener("click", getCurrentLocation);

let celsiusTemperature = null;

let apiKey = "6efaaef1baet493f7b254do70ae07eb3";

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("Caracas");
