const bookingMain = document.getElementById("bookingMain");

const bookingForm = document.getElementById("bookingForm");
const bookingDestinationInput = document.getElementById("bookingDestination");
const travelerNameInput = document.getElementById("travelerName");
const travelersNumberInput = document.getElementById("travelersNumber");
const durationDaysInput = document.getElementById("durationDays");
const departureDateInput = document.getElementById("departureDate");
const travelBudgetInput = document.getElementById("travelBudget");
const tripTypeSelect = document.getElementById("tripType");
const specialRequestsInput = document.getElementById("specialRequests");

const bookingDestinationError = document.getElementById("bookingDestinationError");
const travelerNameError = document.getElementById("travelerNameError");
const travelersNumberError = document.getElementById("travelersNumberError");
const durationDaysError = document.getElementById("durationDaysError");
const departureDateError = document.getElementById("departureDateError");
const travelBudgetError = document.getElementById("travelBudgetError");
const tripTypeError = document.getElementById("tripTypeError");
const specialRequestsError = document.getElementById("specialRequestsError");
const bookingFormMessage = document.getElementById("bookingFormMessage");

const bookingPreview = document.getElementById("bookingPreview");
const bookingsList = document.getElementById("bookingsList");

const bookingUser = JSON.parse(localStorage.getItem("travelMateUser"));

const destinationSlugs = {
  rome: "Rome, Italy",
  paris: "Paris, France",
  tokyo: "Tokyo, Japan",
  barcelona: "Barcelona, Spain"
};

if (!bookingUser) {
  bookingMain.innerHTML = `
    <section class="access-denied-card">
      <h1>Access denied</h1>
      <p>You must be logged in to create a booking.</p>
      <a href="login.html" class="btn primary-btn">Go to login</a>
    </section>
  `;
} else {
  setDefaultBookingData();
  loadBookings();

  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();
    saveBooking();
  });

  bookingDestinationInput.addEventListener("input", updateBookingPreview);
  travelerNameInput.addEventListener("input", updateBookingPreview);
  travelersNumberInput.addEventListener("input", updateBookingPreview);
  durationDaysInput.addEventListener("input", updateBookingPreview);
  departureDateInput.addEventListener("input", updateBookingPreview);
  travelBudgetInput.addEventListener("input", updateBookingPreview);
  tripTypeSelect.addEventListener("change", updateBookingPreview);
  specialRequestsInput.addEventListener("input", updateBookingPreview);
}

function setDefaultBookingData() {
  const params = new URLSearchParams(window.location.search);
  const destinationSlug = params.get("destination");

  if (destinationSlug && destinationSlugs[destinationSlug]) {
    bookingDestinationInput.value = destinationSlugs[destinationSlug];
  }

  travelerNameInput.value = bookingUser.username;

  updateBookingPreview();
}

function getBookings() {
  return JSON.parse(localStorage.getItem("travelMateBookings")) || [];
}

function saveBooking() {
  const destination = bookingDestinationInput.value.trim();
  const travelerName = travelerNameInput.value.trim();
  const travelersNumber = Number(travelersNumberInput.value);
  const durationDays = Number(durationDaysInput.value);
  const departureDate = departureDateInput.value;
  const travelBudget = Number(travelBudgetInput.value);
  const tripType = tripTypeSelect.value;
  const specialRequests = specialRequestsInput.value.trim();

  clearBookingMessages();

  let isValid = true;

  if (destination === "") {
    bookingDestinationError.textContent = "Destination is required";
    isValid = false;
  }

  if (travelerName === "") {
    travelerNameError.textContent = "Traveler name is required";
    isValid = false;
  } else if (travelerName.length < 2) {
    travelerNameError.textContent = "Traveler name must be at least 2 characters";
    isValid = false;
  }

  if (!travelersNumber) {
    travelersNumberError.textContent = "Number of travelers is required";
    isValid = false;
  } else if (travelersNumber < 1 || travelersNumber > 10) {
    travelersNumberError.textContent = "Travelers must be between 1 and 10";
    isValid = false;
  }

  if (!durationDays) {
    durationDaysError.textContent = "Duration is required";
    isValid = false;
  } else if (durationDays < 1 || durationDays > 60) {
    durationDaysError.textContent = "Duration must be between 1 and 60 days";
    isValid = false;
  }

  if (departureDate === "") {
    departureDateError.textContent = "Departure date is required";
    isValid = false;
  } else if (isPastDate(departureDate)) {
    departureDateError.textContent = "Departure date cannot be in the past";
    isValid = false;
  }

  if (!travelBudget) {
    travelBudgetError.textContent = "Budget is required";
    isValid = false;
  } else if (travelBudget < 100) {
    travelBudgetError.textContent = "Budget must be at least 100€";
    isValid = false;
  }

  if (tripType === "") {
    tripTypeError.textContent = "Trip type is required";
    isValid = false;
  }

  if (specialRequests === "") {
    specialRequestsError.textContent = "Special requests are required";
    isValid = false;
  } else if (specialRequests.length < 10) {
    specialRequestsError.textContent = "Special requests must be at least 10 characters";
    isValid = false;
  }

  if (!isValid) {
    bookingFormMessage.textContent = "Please complete the form correctly.";
    bookingFormMessage.classList.add("error");
    return;
  }

  const newBooking = {
    id: Date.now(),
    destination: destination,
    travelerName: travelerName,
    travelersNumber: travelersNumber,
    durationDays: durationDays,
    departureDate: departureDate,
    travelBudget: travelBudget,
    tripType: tripType,
    specialRequests: specialRequests,
    createdAt: new Date().toLocaleString()
  };

  const bookings = getBookings();

  bookings.push(newBooking);

  localStorage.setItem("travelMateBookings", JSON.stringify(bookings));

  bookingForm.reset();

  travelerNameInput.value = bookingUser.username;

  bookingFormMessage.textContent = "Booking saved successfully!";
  bookingFormMessage.classList.add("success");

  updateBookingPreview();
  loadBookings();
}

function updateBookingPreview() {
  const destination = bookingDestinationInput.value.trim() || "Destination not selected";
  const travelerName = travelerNameInput.value.trim() || "Traveler not added";
  const travelersNumber = travelersNumberInput.value || "0";
  const durationDays = durationDaysInput.value || "0";
  const departureDate = departureDateInput.value
    ? formatDate(departureDateInput.value)
    : "Date not selected";
  const travelBudget = travelBudgetInput.value || "0";
  const tripType = tripTypeSelect.value || "Trip type not selected";

  bookingPreview.innerHTML = `
    <div class="booking-preview-icon">
      ✈️
    </div>

    <h3>${destination}</h3>

    <div class="booking-preview-details">
      <p>
        <strong>Traveler</strong>
        <span>${travelerName}</span>
      </p>

      <p>
        <strong>Travelers</strong>
        <span>${travelersNumber}</span>
      </p>

      <p>
        <strong>Departure</strong>
        <span>${departureDate}</span>
      </p>

      <p>
        <strong>Duration</strong>
        <span>${durationDays} days</span>
      </p>

      <p>
        <strong>Budget</strong>
        <span>€${travelBudget}</span>
      </p>

      <p>
        <strong>Trip type</strong>
        <span>${tripType}</span>
      </p>
    </div>
  `;
}

function loadBookings() {
  const bookings = getBookings();

  bookingsList.innerHTML = "";

  if (bookings.length === 0) {
    bookingsList.innerHTML = `
      <div class="empty-state compact-empty-state">
        <h3>No bookings yet</h3>
        <p>Create your first booking using the form above.</p>
      </div>
    `;
    return;
  }

  bookings.forEach(function (booking) {
    const bookingCard = createBookingCard(booking);
    bookingsList.appendChild(bookingCard);
  });
}

function createBookingCard(booking) {
  const card = document.createElement("article");
  card.classList.add("saved-booking-card");

  card.innerHTML = `
    <div class="saved-booking-header">
      <div>
        <p class="card-label">${booking.tripType}</p>
        <h3>${booking.destination}</h3>
        <p>Booking created on ${booking.createdAt}</p>
      </div>

      <button class="remove-booking-btn">
        Remove booking
      </button>
    </div>

    <div class="trip-details-grid">
      <p>
        <strong>Traveler</strong>
        <span>${booking.travelerName}</span>
      </p>

      <p>
        <strong>Travelers</strong>
        <span>${booking.travelersNumber}</span>
      </p>

      <p>
        <strong>Departure</strong>
        <span>${formatDate(booking.departureDate)}</span>
      </p>

      <p>
        <strong>Duration</strong>
        <span>${booking.durationDays} days</span>
      </p>

      <p>
        <strong>Budget</strong>
        <span>€${booking.travelBudget}</span>
      </p>
    </div>

    <div class="trip-notes-box">
      <strong>Special requests</strong>
      <p>${booking.specialRequests}</p>
    </div>
  `;

  const removeButton = card.querySelector(".remove-booking-btn");

  removeButton.addEventListener("click", function () {
    removeBooking(booking.id);
  });

  return card;
}

function removeBooking(bookingId) {
  const bookings = getBookings();

  const updatedBookings = bookings.filter(function (booking) {
    return booking.id !== bookingId;
  });

  localStorage.setItem("travelMateBookings", JSON.stringify(updatedBookings));

  loadBookings();
}

function clearBookingMessages() {
  bookingDestinationError.textContent = "";
  travelerNameError.textContent = "";
  travelersNumberError.textContent = "";
  durationDaysError.textContent = "";
  departureDateError.textContent = "";
  travelBudgetError.textContent = "";
  tripTypeError.textContent = "";
  specialRequestsError.textContent = "";
  bookingFormMessage.textContent = "";

  bookingFormMessage.classList.remove("success");
  bookingFormMessage.classList.remove("error");
}

function isPastDate(dateString) {
  const selectedDate = new Date(dateString);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return selectedDate < today;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}