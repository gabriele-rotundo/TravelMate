const profileMain = document.getElementById("profileMain");

const profileAvatar = document.getElementById("profileAvatar");
const profileUsername = document.getElementById("profileUsername");
const accountUsername = document.getElementById("accountUsername");
const accountLoginTime = document.getElementById("accountLoginTime");
const accountFavouriteDestination = document.getElementById("accountFavouriteDestination");

const profileForm = document.getElementById("profileForm");
const fullNameInput = document.getElementById("fullName");
const favouriteDestinationInput = document.getElementById("favouriteDestination");

const fullNameError = document.getElementById("fullNameError");
const favouriteDestinationError = document.getElementById("favouriteDestinationError");
const profileMessage = document.getElementById("profileMessage");

const profileSavedDestinationsList = document.getElementById("profileSavedDestinationsList");
const profilePlannedTripsList = document.getElementById("profilePlannedTripsList");
const profileBookingsList = document.getElementById("profileBookingsList");


const profileUser = JSON.parse(localStorage.getItem("travelMateUser"));

if (!profileUser) {
  profileMain.innerHTML = `
    <section class="access-denied-card">
      <h1>Access denied</h1>
      <p>You must be logged in to view your profile.</p>
      <a href="login.html" class="btn primary-btn">Go to login</a>
    </section>
  `;
} else {
  loadProfileData();
  loadProfileDashboard();

  profileForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = fullNameInput.value.trim();
    const favouriteDestination = favouriteDestinationInput.value.trim();

    clearProfileMessages();

    let isValid = true;

    if (fullName === "") {
      fullNameError.textContent = "Full name is required";
      isValid = false;
    }

    if (favouriteDestination === "") {
      favouriteDestinationError.textContent = "Favourite destination is required";
      isValid = false;
    }

    if (!isValid) {
      profileMessage.textContent = "Please complete the form correctly.";
      profileMessage.classList.add("error");
      return;
    }

    const profileData = {
      fullName: fullName,
      favouriteDestination: favouriteDestination
    };

    localStorage.setItem("travelMateProfile", JSON.stringify(profileData));

    accountFavouriteDestination.textContent = favouriteDestination;

    profileMessage.textContent = "Profile updated successfully!";
    profileMessage.classList.add("success");
  });
}

function loadProfileData() {
  const savedProfile = JSON.parse(localStorage.getItem("travelMateProfile"));

  profileAvatar.textContent = profileUser.username.charAt(0).toUpperCase();
  profileUsername.textContent = profileUser.username;
  accountUsername.textContent = profileUser.username;
  accountLoginTime.textContent = profileUser.loginTime;

  if (savedProfile) {
    fullNameInput.value = savedProfile.fullName;
    favouriteDestinationInput.value = savedProfile.favouriteDestination;
    accountFavouriteDestination.textContent = savedProfile.favouriteDestination;
  }
}

function clearProfileMessages() {
  fullNameError.textContent = "";
  favouriteDestinationError.textContent = "";
  profileMessage.textContent = "";

  profileMessage.classList.remove("success");
  profileMessage.classList.remove("error");
}

function loadProfileDashboard() {
  loadProfileSavedDestinations();
  loadProfilePlannedTrips();
  loadProfileBookings();
}

function loadProfileSavedDestinations() {
  const savedDestinations =
    JSON.parse(localStorage.getItem("travelMateSavedDestinations")) || [];

  profileSavedDestinationsList.innerHTML = "";

  if (savedDestinations.length === 0) {
    profileSavedDestinationsList.innerHTML = `
      <div class="profile-empty-item">
        <p>No saved destinations yet.</p>
      </div>
    `;
    return;
  }

  savedDestinations.slice(0, 3).forEach(function (destination) {
    const item = document.createElement("article");
    item.classList.add("profile-data-item");

    const flagContent = destination.flagImage
      ? `<img src="${destination.flagImage}" alt="Flag of ${destination.country}" class="profile-data-flag">`
      : `<span class="profile-data-emoji">${destination.flagEmoji || "🌍"}</span>`;

    item.innerHTML = `
      <div class="profile-data-icon">
        ${flagContent}
      </div>

      <div>
        <h4>${destination.name}</h4>
        <p>${destination.country || "Saved destination"}</p>
      </div>
    `;

    profileSavedDestinationsList.appendChild(item);
  });

  if (savedDestinations.length > 3) {
    profileSavedDestinationsList.innerHTML += `
      <a href="itinerary.html" class="profile-view-more">
        View all saved destinations
      </a>
    `;
  }
}

function loadProfilePlannedTrips() {
  const plannedTrips =
    JSON.parse(localStorage.getItem("travelMatePlannedTrips")) || [];

  profilePlannedTripsList.innerHTML = "";

  if (plannedTrips.length === 0) {
    profilePlannedTripsList.innerHTML = `
      <div class="profile-empty-item">
        <p>No planned trips yet.</p>
      </div>
    `;
    return;
  }

  plannedTrips.slice(0, 3).forEach(function (trip) {
    const item = document.createElement("article");
    item.classList.add("profile-data-item");

    item.innerHTML = `
      <div class="profile-data-icon">
        🧳
      </div>

      <div>
        <h4>${trip.destination.name}</h4>
        <p>${formatProfileDate(trip.startDate)} - ${formatProfileDate(trip.endDate)}</p>
      </div>
    `;

    profilePlannedTripsList.appendChild(item);
  });

  if (plannedTrips.length > 3) {
    profilePlannedTripsList.innerHTML += `
      <a href="itinerary.html" class="profile-view-more">
        View all planned trips
      </a>
    `;
  }
}

function loadProfileBookings() {
  const bookings =
    JSON.parse(localStorage.getItem("travelMateBookings")) || [];

  profileBookingsList.innerHTML = "";

  if (bookings.length === 0) {
    profileBookingsList.innerHTML = `
      <div class="profile-empty-item">
        <p>No bookings yet.</p>
      </div>
    `;
    return;
  }

  bookings.slice(0, 3).forEach(function (booking) {
    const item = document.createElement("article");
    item.classList.add("profile-data-item");

    item.innerHTML = `
      <div class="profile-data-icon">
        ✈️
      </div>

      <div>
        <h4>${booking.destination}</h4>
        <p>${booking.tripType} - ${formatProfileDate(booking.departureDate)}</p>
      </div>
    `;

    profileBookingsList.appendChild(item);
  });

  if (bookings.length > 3) {
    profileBookingsList.innerHTML += `
      <a href="booking.html" class="profile-view-more">
        View all bookings
      </a>
    `;
  }
}

function formatProfileDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}