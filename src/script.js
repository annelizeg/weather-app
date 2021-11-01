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

let thisDay = document.querySelector("#current-day");
let thisDate = document.querySelector("#current-date");
let thisMonth = document.querySelector("#current-month");
let thisYear = document.querySelector("#current-year");
let thisHours = document.querySelector("#current-hour");
let thisMinutes = document.querySelector("#current-minutes");
let thisAmPm = document.querySelector("#current-AmPm");

thisDay.innerHTML = days[day];
thisDate.innerHTML = date;
thisMonth.innerHTML = months[month];
thisYear.innerHTML = year;
thisHours.innerHTML = hours;
thisMinutes.innerHTML = minutes;

if (hours >= 12) {
  thisAmPm.innerHTML = "PM";
} else {
  thisAmPm.innerHTML = "AM";
}

// Access weather when selecting a city via form input
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

let searchCityForm = document.querySelector("#search-city-form");
searchCityForm.addEventListener("submit", selectCity);

// Access weather when "Current" position button is used
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

let currentLocation = document.querySelector("#current-location-button");
currentLocation.addEventListener("click", accessPosition);

// Update weather data for selected city or current position
function updateCityWeather(response) {
  // console.log(response.data);
  let displayCity = document.querySelector("#display-city");
  displayCity.innerHTML = response.data.name;

  let displayTemp = document.querySelector("#current-temp");
  displayTemp.innerHTML = Math.round(response.data.main.temp);
  let weatherDescription = document.querySelector("#weather-description");
  weatherDescription.innerHTML = response.data.weather[0].description;
  weatherDescription.innerHTML = weatherDescription.innerHTML.toUpperCase();

  let todayHigh = document.querySelector("#today-high");
  todayHigh.innerHTML = Math.round(response.data.main.temp_max);
  let todayLow = document.querySelector("#today-low");
  todayLow.innerHTML = Math.round(response.data.main.temp_min);

  if (response.data.rain === null || response.data.rain === undefined) {
    let todayPrecipitation = document.querySelector("#today-precipitation");
    todayPrecipitation.innerHTML = "0";
  } else {
    let todayPrecipitation = document.querySelector("#today-precipitation");
    todayPrecipitation.innerHTML =
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

// Swap Celsius & Fahrenheit
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

let celsiusButton = document.querySelector(".celsius-button");
let fahrenheitButton = document.querySelector(".fahrenheit-button");

celsiusButton.addEventListener("click", updateToCelsius);
fahrenheitButton.addEventListener("click", updateToFahrenheit);

// Access set city weather upon loading page
accessCityWeather("Adelaide");
