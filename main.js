const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};

let unit = "metric"; // Default unit is Celsius
const unitToggleButton = document.querySelector('.unit-toggle');
const searchbox = document.querySelector('.search-box');

searchbox.addEventListener('keypress', setQuery);
unitToggleButton.addEventListener('click', toggleUnit);

function setQuery(evt) {
  if (evt.key === "Enter") {
    getResults(searchbox.value);
  }
}

function toggleUnit() {
  // Switch unit
  if (unit === "metric") {
    unit = "imperial";
    unitToggleButton.innerText = "°C"; // Update button to Celsius
  } else {
    unit = "metric";
    unitToggleButton.innerText = "°F"; // Update button to Fahrenheit
  }
  // Fetch updated weather data
  if (searchbox.value) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=${unit}&APPID=${api.key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("City not found");
      }
      return response.json();
    })
    .then(displayResults)
    .catch(error => {
      displayError(error.message);
    });
}

function displayResults(weather) {
  document.querySelector('.error-message').style.display = "none";

  const city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  const now = new Date();
  const date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  const temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>${unit === "metric" ? "°C" : "°F"}</span>`;

  const weatherEl = document.querySelector('.current .weather');
  weatherEl.innerText = weather.weather[0].main;

  const icon = document.querySelector('.current .icon');
  icon.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
  icon.alt = weather.weather[0].description;

  const hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}${unit === "metric" ? "°C" : "°F"} / ${Math.round(weather.main.temp_max)}${unit === "metric" ? "°C" : "°F"}`;

  const wind = document.querySelector('.details .wind');
  const windSpeed = unit === "metric" ? `${Math.round(weather.wind.speed)} km/h` : `${Math.round(weather.wind.speed)} mph`;
  wind.innerText = `Wind: ${windSpeed}`;

  const humidity = document.querySelector('.details .humidity');
  humidity.innerText = `Humidity: ${weather.main.humidity}%`;
}

function displayError(message) {
  const errorMessage = document.querySelector('.error-message');
  errorMessage.style.display = "block";
  errorMessage.innerText = message;
}

function dateBuilder(d) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

  