// Current date & time
function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

let now = new Date();

let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let day = now.getDay();
let date = now.getDate();
let month = now.getMonth();
let year = now.getFullYear();
let hours = addZero(now.getHours());
let minutes = addZero(now.getMinutes());

document.querySelector("#current-day").innerHTML = days[day];
document.querySelector("#current-date").innerHTML = date;
document.querySelector("#current-month").innerHTML = months[month];
document.querySelector("#current-year").innerHTML = year;
document.querySelector("#current-hour").innerHTML = hours;
document.querySelector("#current-minutes").innerHTML = minutes;
let thisAmPm = document.querySelector("#current-AmPm");

if (hours >= 12) {
  thisAmPm.innerHTML = "PM";
} else {
  thisAmPm.innerHTML = "AM";
}

// Access weather & forcast for either a selected city or current position
function selectCity(event) {
  event.preventDefault();
  let citySearchInput = document.querySelector("#search-city-input");
  accessCityWeather(citySearchInput.value);
}

function accessCityWeather(city) {
  let selectedCity = city;
  let weatherApiKey = "52fbb143d82a4151063455d0b96cd0e1";
  let weatherUnits = "metric";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&units=${weatherUnits}&appid=${weatherApiKey}`;
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=${weatherUnits}&appid=${weatherApiKey}`;

  axios.get(weatherApiUrl).then(updateCityWeather);
  axios.get(forecastApiUrl).then(updateForecastWeather);
}

function accessPosition() {
  navigator.geolocation.getCurrentPosition(accessPositionWeather);
}

function accessPositionWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let weatherApiKey = "52fbb143d82a4151063455d0b96cd0e1";
  let weatherUnits = "metric";
  let weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${weatherUnits}&appid=${weatherApiKey}`;
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${weatherUnits}&appid=${weatherApiKey}`;
  axios.get(weatherApiUrl).then(updateCityWeather);
  axios.get(forecastApiUrl).then(updateForecastWeather);
}

function updateCityWeather(response) {
  // console.log(response.data);
  let displayCity = document.querySelector("#display-city");
  displayCity.innerHTML = response.data.name;

  let displayTemp = document.querySelector("#current-temp");
  displayTemp.innerHTML = Math.round(response.data.main.temp);
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;

  let todayHigh = document.querySelector("#today-high");
  todayHigh.innerHTML = Math.round(response.data.main.temp_max);
  let todayLow = document.querySelector("#today-low");
  todayLow.innerHTML = Math.round(response.data.main.temp_min);

  if (response.data.rain === null || response.data.rain === undefined) {
    document.querySelector("#today-precipitation").innerHTML = "0";
  } else {
    document.querySelector("#today-precipitation").innerHTML =
      Math.round(response.data.rain["1h"] * 10) / 10;
  }

  let todayHumidity = document.querySelector("#today-humidity");
  todayHumidity.innerHTML = Math.round(response.data.main.humidity);
  let todayWindspeed = document.querySelector("#today-windspeed");
  todayWindspeed.innerHTML = Math.round(response.data.wind.speed * 3.6); //includes conversion from m/sec to km/hr
  let todayWindDirection = document.querySelector("#today-wind-direction");
  todayWindDirection.innerHTML = Math.round(response.data.wind.deg);
}

function updateForecastWeather(response) {
  // console.log(response.data);
  // This is a work in procress for next week
}

function updateToCelsius() {
  let displayTemp = document.querySelectorAll(".temp");

  for (let i = 0; i < displayTemp.length; i++) {
    displayTemp[i].innerHTML = Math.round(
      ((displayTemp[i].innerHTML - 32) * 5) / 9
    );
  }

  let celsiusButton = document.querySelector(".celsius-button");
  celsiusButton.classList.add("celsius-button-selected");

  let fahrenheitButton = document.querySelector(".fahrenheit-button");
  fahrenheitButton.classList.remove("fahrenheit-button-selected");

  celsiusButton.disabled = true;
  fahrenheitButton.disabled = false;

  let todayTempUnits = document.querySelectorAll(".temp-units");

  for (let i = 0; i < todayTempUnits.length; i++) {
    todayTempUnits[i].innerHTML = "℃";
  }
}

function updateToFahrenheit() {
  let displayTemp = document.querySelectorAll(".temp");

  for (let i = 0; i < displayTemp.length; i++) {
    displayTemp[i].innerHTML = Math.round(
      (displayTemp[i].innerHTML * 9) / 5 + 32
    );
  }

  let fahrenheitButton = document.querySelector(".fahrenheit-button");
  fahrenheitButton.classList.add("fahrenheit-button-selected");

  let celsiusButton = document.querySelector(".celsius-button");
  celsiusButton.classList.remove("celsius-button-selected");

  fahrenheitButton.disabled = true;
  celsiusButton.disabled = false;

  let todayTempUnits = document.querySelectorAll(".temp-units");

  for (let i = 0; i < todayTempUnits.length; i++) {
    todayTempUnits[i].innerHTML = "℉";
  }
}

let searchCityForm = document.querySelector("#search-city-form");
searchCityForm.addEventListener("submit", selectCity);

let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", accessPosition);

let celsiusButton = document.querySelector(".celsius-button");
celsiusButton.addEventListener("click", updateToCelsius);
let fahrenheitButton = document.querySelector(".fahrenheit-button");
fahrenheitButton.addEventListener("click", updateToFahrenheit);

accessCityWeather("Adelaide");
