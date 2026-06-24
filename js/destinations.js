const destinationSearchForm = document.getElementById("destinationSearchForm");
const countrySearchInput = document.getElementById("countrySearch");
const countrySearchError = document.getElementById("countrySearchError");
const searchMessage = document.getElementById("searchMessage");

const resultsGrid = document.getElementById("resultsGrid");
const loadingMessage = document.getElementById("loadingMessage");

destinationSearchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const searchTerm = countrySearchInput.value.trim();

  clearSearchMessages();

  if (searchTerm === "") {
    countrySearchError.textContent = "Please enter a destination name";
    return;
  }

  await searchDestination(searchTerm);
});

async function searchDestination(searchTerm) {
  try {
    showLoading(true);
    resultsGrid.innerHTML = "";

    const apiUrl =
      "https://nominatim.openstreetmap.org/search?format=jsonv2" +
      "&addressdetails=1" +
      "&limit=6" +
      "&accept-language=en" +
      "&q=" +
      encodeURIComponent(searchTerm);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Unable to load destinations");
    }

    const destinations = await response.json();

    showLoading(false);

    if (!destinations || destinations.length === 0) {
      showNoResults();
      return;
    }

    const sortedDestinations = sortDestinations(destinations, searchTerm);
    displayDestinations(sortedDestinations);
  } catch (error) {
    showLoading(false);

    resultsGrid.innerHTML = `
      <div class="empty-state">
        <h3>Something went wrong</h3>
        <p>Unable to load destinations right now. Please try again later.</p>
      </div>
    `;
  }
}

function sortDestinations(destinations, searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase();

  return destinations.sort(function (a, b) {
    const nameA = getPlaceName(a).toLowerCase();
    const nameB = getPlaceName(b).toLowerCase();

    const aExact = nameA === normalizedSearch ? 1 : 0;
    const bExact = nameB === normalizedSearch ? 1 : 0;

    if (aExact !== bExact) {
      return bExact - aExact;
    }

    const importanceA = Number(a.importance) || 0;
    const importanceB = Number(b.importance) || 0;

    return importanceB - importanceA;
  });
}

function displayDestinations(destinations) {
  resultsGrid.innerHTML = "";

  destinations.forEach(function (destination) {
    const destinationCard = createDestinationCard(destination);
    resultsGrid.appendChild(destinationCard);
  });
}

function createDestinationCard(destination) {
  const name = getPlaceName(destination);
  const country = getCountry(destination);
  const countryCode = getCountryCode(destination);
  const region = getRegion(destination);
  const placeType = formatPlaceType(destination.type);
  const fullAddress = destination.display_name || "Not available";
  const latitude = destination.lat;
  const longitude = destination.lon;
  const importance = destination.importance
    ? Number(destination.importance).toFixed(2)
    : "Not available";

  const flagEmoji = getFlagEmoji(countryCode);
  const flagImage = getFlagImageUrl(countryCode);

  const card = document.createElement("article");
  card.classList.add("destination-card");

  card.innerHTML = `
    <div class="destination-media">
      <div class="destination-image-card">
        ${
          flagImage
            ? `<img src="${flagImage}" alt="Flag of ${country}" class="destination-flag-img">`
            : `<div class="destination-big-emoji">${flagEmoji}</div>`
        }

        <div class="destination-emoji-badge">
          ${flagEmoji}
        </div>
      </div>

      <div class="destination-mini-details">
        <span>📍 ${placeType}</span>
        <span>🌍 ${country}</span>
      </div>
    </div>

    <div class="destination-card-content">
      <p class="card-label">${placeType}</p>

      <h3>${name}</h3>
      <p class="official-name">${fullAddress}</p>

      <div class="destination-info-grid">
        <p>
          <strong>Country</strong>
          <span>${country}</span>
        </p>

        <p>
          <strong>Region</strong>
          <span>${region}</span>
        </p>

        <p>
          <strong>Place type</strong>
          <span>${placeType}</span>
        </p>

        <p>
          <strong>Latitude</strong>
          <span>${latitude}</span>
        </p>

        <p>
          <strong>Longitude</strong>
          <span>${longitude}</span>
        </p>

        <p>
          <strong>Search importance</strong>
          <span>${importance}</span>
        </p>
      </div>

      <div class="weather-box hidden">
        <!-- Weather data will be inserted here -->
      </div>

      <div class="destination-actions">
        <button class="btn secondary-btn full-width-btn weather-btn">
          Show weather
        </button>

        <button class="btn primary-btn full-width-btn save-destination-btn">
          Save destination
        </button>
      </div>
    </div>
  `;

  const weatherButton = card.querySelector(".weather-btn");
  const weatherBox = card.querySelector(".weather-box");
  const saveButton = card.querySelector(".save-destination-btn");

  weatherButton.addEventListener("click", function () {
    loadWeather(latitude, longitude, name, country, weatherBox, weatherButton);
  });

  saveButton.addEventListener("click", function () {
    saveDestination({
      id: destination.place_id,
      name: name,
      country: country,
      countryCode: countryCode,
      region: region,
      placeType: placeType,
      fullAddress: fullAddress,
      latitude: latitude,
      longitude: longitude,
      flagEmoji: flagEmoji,
      flagImage: flagImage
    });
  });

  return card;
}

async function loadWeather(latitude, longitude, name, country, weatherBox, weatherButton) {
  try {
    weatherButton.textContent = "Loading weather...";

    const weatherUrl =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      latitude +
      "&longitude=" +
      longitude +
      "&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto";

    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error("Unable to load weather");
    }

    const data = await response.json();
    const currentWeather = data.current;

    const temperature = currentWeather.temperature_2m;
    const windSpeed = currentWeather.wind_speed_10m;
    const weatherCode = currentWeather.weather_code;

    const weatherDescription = getWeatherDescription(weatherCode);
    const weatherIcon = getWeatherIcon(weatherCode);

    weatherBox.classList.remove("hidden");

    const weatherTitle = getWeatherTitle(name, country);

weatherBox.innerHTML = `
  <div class="weather-header">
    <div class="weather-icon">
      ${weatherIcon}
    </div>

    <div>
      <h4>${weatherTitle}</h4>
      <p>${weatherDescription}</p>
    </div>
  </div>

      <div class="weather-grid">
        <p>
          <strong>Temperature</strong>
          <span>${temperature} °C</span>
        </p>

        <p>
          <strong>Wind speed</strong>
          <span>${windSpeed} km/h</span>
        </p>

        <p>
          <strong>Coordinates</strong>
          <span>${latitude}, ${longitude}</span>
        </p>
      </div>
    `;

    weatherButton.textContent = "Refresh weather";
  } catch (error) {
    weatherBox.classList.remove("hidden");

    weatherBox.innerHTML = `
      <h4>Weather unavailable</h4>
      <p>Unable to load weather data for this destination.</p>
    `;

    weatherButton.textContent = "Try again";
  }
}

function getPlaceName(destination) {
  if (destination.name) {
    return destination.name;
  }

  if (destination.address) {
    return (
      destination.address.city ||
      destination.address.town ||
      destination.address.village ||
      destination.address.municipality ||
      destination.address.state ||
      destination.address.country ||
      "Unknown destination"
    );
  }

  if (destination.display_name) {
    return destination.display_name.split(",")[0];
  }

  return "Unknown destination";
}

function getCountry(destination) {
  if (destination.address && destination.address.country) {
    return destination.address.country;
  }

  return "Not available";
}

function getCountryCode(destination) {
  if (destination.address && destination.address.country_code) {
    return destination.address.country_code.toUpperCase();
  }

  return "";
}

function getRegion(destination) {
  if (!destination.address) {
    return "Not available";
  }

  return (
    destination.address.state ||
    destination.address.region ||
    destination.address.county ||
    destination.address.province ||
    destination.address.country ||
    "Not available"
  );
}

function formatPlaceType(type) {
  if (!type) {
    return "Destination";
  }

  return type
    .replace(/_/g, " ")
    .replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
}

function saveDestination(destination) {
  const loggedUser = JSON.parse(localStorage.getItem("travelMateUser"));

  searchMessage.textContent = "";
  searchMessage.classList.remove("success");
  searchMessage.classList.remove("error");

  if (!loggedUser) {
    searchMessage.innerHTML = `
      Please login to save destinations.
      <a href="login.html">Go to login</a>
    `;
    searchMessage.classList.add("error");
    return;
  }

  const savedDestinations =
    JSON.parse(localStorage.getItem("travelMateSavedDestinations")) || [];

  const alreadySaved = savedDestinations.some(function (savedDestination) {
    return savedDestination.id === destination.id;
  });

  if (alreadySaved) {
    searchMessage.textContent = "This destination is already saved.";
    searchMessage.classList.add("error");
    return;
  }

  savedDestinations.push(destination);

  localStorage.setItem(
    "travelMateSavedDestinations",
    JSON.stringify(savedDestinations)
  );

  searchMessage.textContent = destination.name + " saved successfully!";
  searchMessage.classList.add("success");
}

function getFlagEmoji(countryCode) {
  if (!countryCode) {
    return "🌍";
  }

  return countryCode
    .toUpperCase()
    .replace(/./g, function (char) {
      return String.fromCodePoint(127397 + char.charCodeAt());
    });
}

function getFlagImageUrl(countryCode) {
  if (!countryCode) {
    return "";
  }

  return "https://flagcdn.com/w320/" + countryCode.toLowerCase() + ".png";
}

function getWeatherTitle(name, country) {
  if (!country || country === "Not available") {
    return "Current weather in " + name;
  }

  if (name.toLowerCase() === country.toLowerCase()) {
    return "Current weather in " + name;
  }

  return "Current weather in " + name + ", " + country;
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm"
  };

  return weatherCodes[code] || "Unknown weather";
}

function getWeatherIcon(code) {
  if (code === 0) {
    return "☀️";
  }

  if (code === 1 || code === 2) {
    return "🌤️";
  }

  if (code === 3) {
    return "☁️";
  }

  if (code === 45 || code === 48) {
    return "🌫️";
  }

  if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) {
    return "🌧️";
  }

  if (code >= 71 && code <= 75) {
    return "❄️";
  }

  if (code === 95) {
    return "⛈️";
  }

  return "🌍";
}

function showNoResults() {
  resultsGrid.innerHTML = `
    <div class="empty-state">
      <h3>No results found</h3>
      <p>Try searching for another destination, for example Italy, Rome, Tokyo or Vietnam.</p>
    </div>
  `;
}

function clearSearchMessages() {
  countrySearchError.textContent = "";
  searchMessage.textContent = "";
  searchMessage.classList.remove("success");
  searchMessage.classList.remove("error");
}

function showLoading(isLoading) {
  if (isLoading) {
    loadingMessage.classList.remove("hidden");
  } else {
    loadingMessage.classList.add("hidden");
  }
}