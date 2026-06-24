const itineraryMain = document.getElementById("itineraryMain");

const savedDestinationsList = document.getElementById("savedDestinationsList");
const plannedTripsList = document.getElementById("plannedTripsList");

const tripForm = document.getElementById("tripForm");
const tripDestinationSelect = document.getElementById("tripDestination");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const tripNotesInput = document.getElementById("tripNotes");

const tripDestinationError = document.getElementById("tripDestinationError");
const startDateError = document.getElementById("startDateError");
const endDateError = document.getElementById("endDateError");
const tripNotesError = document.getElementById("tripNotesError");
const tripFormMessage = document.getElementById("tripFormMessage");

const itineraryUser = JSON.parse(localStorage.getItem("travelMateUser"));

if (!itineraryUser) {
  itineraryMain.innerHTML = `
    <section class="access-denied-card">
      <h1>Access denied</h1>
      <p>You must be logged in to manage your itinerary.</p>
      <a href="login.html" class="btn primary-btn">Go to login</a>
    </section>
  `;
} else {
  loadSavedDestinations();
  loadPlannedTrips();

  tripForm.addEventListener("submit", function (event) {
    event.preventDefault();

    createTrip();
  });
}

function getSavedDestinations() {
  return JSON.parse(localStorage.getItem("travelMateSavedDestinations")) || [];
}

function getPlannedTrips() {
  return JSON.parse(localStorage.getItem("travelMatePlannedTrips")) || [];
}

function loadSavedDestinations() {
  const savedDestinations = getSavedDestinations();

  savedDestinationsList.innerHTML = "";
  tripDestinationSelect.innerHTML = `
    <option value="">Select a saved destination</option>
  `;

  if (savedDestinations.length === 0) {
    savedDestinationsList.innerHTML = `
      <div class="empty-state compact-empty-state">
        <h3>No saved destinations yet</h3>
        <p>Go to the Destinations page and save a place first.</p>
        <a href="destinations.html" class="btn primary-btn">Explore destinations</a>
      </div>
    `;
    return;
  }

  savedDestinations.forEach(function (destination, index) {
    const savedCard = createSavedDestinationCard(destination, index);
    savedDestinationsList.appendChild(savedCard);

    const option = document.createElement("option");
    option.value = index;
    option.textContent = destination.name + " - " + destination.country;
    tripDestinationSelect.appendChild(option);
  });
}

function createSavedDestinationCard(destination, index) {
  const card = document.createElement("article");
  card.classList.add("saved-destination-item");

  const flagContent = destination.flagImage
    ? `<img src="${destination.flagImage}" alt="Flag of ${destination.country}" class="saved-flag-img">`
    : `<span class="saved-flag-emoji">${destination.flagEmoji || "🌍"}</span>`;

  card.innerHTML = `
    <div class="saved-destination-media">
      ${flagContent}
    </div>

    <div class="saved-destination-content">
      <h3>${destination.name}</h3>
      <p>${destination.country}</p>
      <span>${destination.placeType || "Destination"}</span>
    </div>

    <button class="remove-small-btn" aria-label="Remove destination">
      Remove
    </button>
  `;

  const removeButton = card.querySelector(".remove-small-btn");

  removeButton.addEventListener("click", function () {
    removeSavedDestination(index);
  });

  return card;
}

function removeSavedDestination(index) {
  const savedDestinations = getSavedDestinations();

  savedDestinations.splice(index, 1);

  localStorage.setItem(
    "travelMateSavedDestinations",
    JSON.stringify(savedDestinations)
  );

  loadSavedDestinations();
  loadPlannedTrips();
}

function createTrip() {
  const selectedDestinationIndex = tripDestinationSelect.value;
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  const tripNotes = tripNotesInput.value.trim();

  clearTripFormMessages();

  let isValid = true;

  if (selectedDestinationIndex === "") {
    tripDestinationError.textContent = "Please select a destination";
    isValid = false;
  }

  if (startDate === "") {
    startDateError.textContent = "Start date is required";
    isValid = false;
  }

  if (endDate === "") {
    endDateError.textContent = "End date is required";
    isValid = false;
  }

  if (startDate !== "" && endDate !== "" && endDate < startDate) {
    endDateError.textContent = "End date cannot be before start date";
    isValid = false;
  }

  if (tripNotes === "") {
    tripNotesError.textContent = "Trip notes are required";
    isValid = false;
  } else if (tripNotes.length < 10) {
    tripNotesError.textContent = "Trip notes must be at least 10 characters";
    isValid = false;
  }

  if (!isValid) {
    tripFormMessage.textContent = "Please complete the form correctly.";
    tripFormMessage.classList.add("error");
    return;
  }

  const savedDestinations = getSavedDestinations();
  const selectedDestination = savedDestinations[selectedDestinationIndex];

  const newTrip = {
    id: Date.now(),
    destination: selectedDestination,
    startDate: startDate,
    endDate: endDate,
    notes: tripNotes,
    createdAt: new Date().toLocaleString()
  };

  const plannedTrips = getPlannedTrips();

  plannedTrips.push(newTrip);

  localStorage.setItem("travelMatePlannedTrips", JSON.stringify(plannedTrips));

  tripForm.reset();

  tripFormMessage.textContent = "Trip added to your itinerary!";
  tripFormMessage.classList.add("success");

  loadPlannedTrips();
}

function loadPlannedTrips() {
  const plannedTrips = getPlannedTrips();

  plannedTripsList.innerHTML = "";

  if (plannedTrips.length === 0) {
    plannedTripsList.innerHTML = `
      <div class="empty-state compact-empty-state">
        <h3>No trips planned yet</h3>
        <p>Create your first itinerary using the form above.</p>
      </div>
    `;
    return;
  }

  plannedTrips.forEach(function (trip) {
    const tripCard = createTripCard(trip);
    plannedTripsList.appendChild(tripCard);
  });
}

function createTripCard(trip) {
  const card = document.createElement("article");
  card.classList.add("planned-trip-card");

  const destination = trip.destination;

  const flagContent = destination.flagImage
    ? `<img src="${destination.flagImage}" alt="Flag of ${destination.country}" class="trip-flag-img">`
    : `<span class="trip-flag-emoji">${destination.flagEmoji || "🌍"}</span>`;

  card.innerHTML = `
    <div class="planned-trip-header">
      <div class="trip-destination-main">
        <div class="trip-flag-box">
          ${flagContent}
        </div>

        <div>
          <p class="card-label">${destination.country}</p>
          <h3>${destination.name}</h3>
          <p>${destination.region || destination.fullAddress || "Saved destination"}</p>
        </div>
      </div>

      <button class="remove-trip-btn">
        Remove trip
      </button>
    </div>

    <div class="trip-details-grid">
      <p>
        <strong>Start date</strong>
        <span>${formatDate(trip.startDate)}</span>
      </p>

      <p>
        <strong>End date</strong>
        <span>${formatDate(trip.endDate)}</span>
      </p>

      <p>
        <strong>Created at</strong>
        <span>${trip.createdAt}</span>
      </p>
    </div>

    <div class="trip-notes-box">
      <strong>Notes</strong>
      <p>${trip.notes}</p>
    </div>
  `;

  const removeButton = card.querySelector(".remove-trip-btn");

  removeButton.addEventListener("click", function () {
    removeTrip(trip.id);
  });

  return card;
}

function removeTrip(tripId) {
  const plannedTrips = getPlannedTrips();

  const updatedTrips = plannedTrips.filter(function (trip) {
    return trip.id !== tripId;
  });

  localStorage.setItem("travelMatePlannedTrips", JSON.stringify(updatedTrips));

  loadPlannedTrips();
}

function clearTripFormMessages() {
  tripDestinationError.textContent = "";
  startDateError.textContent = "";
  endDateError.textContent = "";
  tripNotesError.textContent = "";
  tripFormMessage.textContent = "";

  tripFormMessage.classList.remove("success");
  tripFormMessage.classList.remove("error");
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}