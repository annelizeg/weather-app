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
  axios.get(weatherApiUrl).then(updateCityWeather);
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
  axios.get(weatherApiUrl).then(updateCityWeather);
}

function accessForecastWeather(coordinates) {
  let weatherApiKey = "52fbb143d82a4151063455d0b96cd0e1";
  let weatherUnits = "metric";
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude=minutely,hourly&units=${weatherUnits}&appid=${weatherApiKey}`;

  axios.get(forecastApiUrl).then(updateForecastWeather);
}

function updateCityWeather(response) {
  // console.log(response.data);
  accessForecastWeather(response.data.coord);

  let displayCity = document.querySelector("#display-city");
  let displayTemp = document.querySelector("#current-temp");
  let weatherDescription = document.querySelector("#weather-description");
  let todayHumidity = document.querySelector("#today-humidity");
  let todayWindspeed = document.querySelector("#today-windspeed");

  displayCity.innerHTML = response.data.name;
  displayTemp.innerHTML = Math.round(response.data.main.temp);
  weatherDescription.innerHTML = response.data.weather[0].description;
  todayHumidity.innerHTML = Math.round(response.data.main.humidity);
  todayWindspeed.innerHTML = Math.round(response.data.wind.speed * 3.6); //includes conversion from m/sec to km/hr

  updateWeatherIcons(response.data.weather[0].icon, "C"); //Parameter "C" required for current index in function

  celsiusButton.disabled = true; //Ensure that C button cannot be clicked upon initial loading of page.
}

function updateTodayPrecipitation(todaysForecast) {
  document.querySelector("#today-precip-chance").innerHTML =
    todaysForecast.pop * 100 + "% chance ";
  document
    .querySelector("#today-precip-volume")
    .classList.add("precip-volume-padding");

  if (todaysForecast.rain > 0) {
    document.querySelector("#today-precip-type").innerHTML = "Rain 🌧";
    document.querySelector("#today-precip-volume").innerHTML =
      Math.round(todaysForecast.rain * 10) / 10 + " mm";
  } else if (todaysForecast.snow > 0) {
    document.querySelector("#today-precip-type").innerHTML = "Snow ❄";
    document.querySelector("#today-precip-volume").innerHTML =
      Math.round(todaysForecast.snow * 10) / 10 + " mm";
  } else {
    document.querySelector("#today-precip-type").innerHTML = "";
    document.querySelector("#today-precip-volume").innerHTML = "";
    document
      .querySelector("#today-precip-volume")
      .classList.remove("precip-volume-padding");
  }
}

function updateTodayUVindex(todaysForecast) {
  // console.log(todaysForecast);
  let todayUVindexElement = document.querySelector("#today-UV-index");
  let todayUVlevelElement = document.querySelector("#today-UV-level");
  let todayUVindex = Math.round(todaysForecast.uvi * 10) / 10;

  if (todayUVindex < 3) {
    todayUVindexElement.innerHTML = todayUVindex;
    todayUVlevelElement.innerHTML = "(low)";
  } else if (todayUVindex === 3 || todayUVindex < 6) {
    todayUVindexElement.innerHTML = todayUVindex;
    todayUVlevelElement.innerHTML = "(moderate)";
  } else if (todayUVindex === 6 || todayUVindex < 8) {
    todayUVindexElement.innerHTML = todayUVindex;
    todayUVlevelElement.innerHTML = "(high)";
  } else if (todayUVindex === 8 || todayUVindex < 11) {
    todayUVindexElement.innerHTML = todayUVindex;
    todayUVlevelElement.innerHTML = "(very high)";
  } else {
    todayUVindexElement.innerHTML = todayUVindex;
    todayUVlevelElement.innerHTML = "(extreme)";
  }
}

function updateTodayHighLowTemp(todaysForecast) {
  let todayHigh = document.querySelector("#today-high");
  let todayLow = document.querySelector("#today-low");

  todayHigh.innerHTML = Math.round(todaysForecast.temp.max);
  todayLow.innerHTML = Math.round(todaysForecast.temp.min);
}

// Consider moving this function further upwards
function formateDay(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function updateForecastWeather(response) {
  // console.log(response.data.daily);

  let forecastElement = document.querySelector("#forecast");
  let forecast = response.data.daily;

  let forecastHTML = `<div class="row gx-1 justify-content-evenly">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > -1 && index < 6) {
      forecastHTML += `<div class="col-2">
      <div class="card text-center">
      <div class="card-body">
      <h5>${formateDay(forecastDay.dt * 1000)}</h5>
      <img src="" alt="weather icon" width="60px" id="weather-icon${index}"/>
      <p>${Math.round(forecastDay.temp.min)}° / <strong> ${Math.round(
        forecastDay.temp.max
      )}°</strong></p>
        </div>
        </div>
        </div>`;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;

  forecast.forEach(function (forecastDay, index) {
    if (index > -1 && index < 6) {
      updateWeatherIcons(forecastDay.weather[0].icon, index);
    }
  });

  updateTodayHighLowTemp(forecast[0]);
  updateTodayPrecipitation(forecast[0]);
  updateTodayUVindex(forecast[0]);
}

function updateToCelsius() {
  let displayTemp = document.querySelectorAll(".temp"); //To select all the different temperatures on app.

  for (let i = 0; i < displayTemp.length; i++) {
    displayTemp[i].innerHTML = Math.round(
      ((displayTemp[i].innerHTML - 32) * 5) / 9
    );
  }

  celsiusButton.classList.add("celsius-button-selected");
  fahrenheitButton.classList.remove("fahrenheit-button-selected");

  celsiusButton.disabled = true;
  fahrenheitButton.disabled = false;

  let todayTempUnits = document.querySelectorAll(".temp-units");

  for (let i = 0; i < todayTempUnits.length; i++) {
    todayTempUnits[i].innerHTML = "℃";
  }
}

function updateToFahrenheit() {
  let displayTemp = document.querySelectorAll(".temp"); //To select all the different temperatures on app.

  for (let i = 0; i < displayTemp.length; i++) {
    displayTemp[i].innerHTML = Math.round(
      (displayTemp[i].innerHTML * 9) / 5 + 32
    );
  }

  fahrenheitButton.classList.add("fahrenheit-button-selected");
  celsiusButton.classList.remove("celsius-button-selected");

  fahrenheitButton.disabled = true;
  celsiusButton.disabled = false;

  let todayTempUnits = document.querySelectorAll(".temp-units");

  for (let i = 0; i < todayTempUnits.length; i++) {
    todayTempUnits[i].innerHTML = "℉";
  }
}

function updateWeatherIcons(iconCode, index) {
  let weatherIcon = document.querySelector("#weather-icon" + index);

  if (iconCode === "01d" || iconCode === "01n") {
    weatherIcon.setAttribute("src", `images/sunny.png`); // Clear Sky
  } else if (iconCode === "02d" || iconCode === "02n") {
    weatherIcon.setAttribute("src", `images/partly-sunny.png`); //Few Clouds
  } else if (iconCode === "03d" || iconCode === "03n") {
    weatherIcon.setAttribute("src", `images/cloudy.png`); //Scattered Clouds
  } else if (iconCode === "04d" || iconCode === "04n") {
    weatherIcon.setAttribute("src", `images/overcast.png`); //Broken Clouds
  } else if (iconCode === "09d" || iconCode === "09n") {
    weatherIcon.setAttribute("src", `images/rain-with-sun.png`); //Shower Rain or drizzle
  } else if (iconCode === "10d" || iconCode === "10n") {
    weatherIcon.setAttribute("src", `images/heavy-rain.png`); //Rain
  } else if (iconCode === "11d" || iconCode === "11n") {
    weatherIcon.setAttribute("src", `images/thunderstorm.png`); //Thunderstorm
  } else if (iconCode === "13d" || iconCode === "13n") {
    weatherIcon.setAttribute("src", `images/snowy.png`); //Snow
  } else if (iconCode === "50d" || iconCode === "50n") {
    weatherIcon.setAttribute("src", `images/fog.png`); //Mist or fog
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
