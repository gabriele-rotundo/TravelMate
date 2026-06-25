const destinations = [
  {
    name: "Rome, Italy",
    icon: "🏛️",
    description:
      "Culture, food, history and unforgettable walks through the city.",
    slug: "rome",
  },
  {
    name: "Paris, France",
    icon: "🗼",
    description: "Romantic streets, museums, cafés and iconic monuments.",
    slug: "paris",
  },
  {
    name: "Tokyo, Japan",
    icon: "🗻",
    description:
      "Modern technology, temples, neon lights and unique food experiences.",
    slug: "tokyo",
  },
  {
    name: "Barcelona, Spain",
    icon: "🌊",
    description:
      "Architecture, beaches, warm weather and Mediterranean culture.",
    slug: "barcelona",
  },
];

const destinationIcon = document.getElementById("destinationIcon");
const destinationName = document.getElementById("destinationName");
const destinationDescription = document.getElementById(
  "destinationDescription",
);

const prevDestination = document.getElementById("prevDestination");
const nextDestination = document.getElementById("nextDestination");
const bookDestination = document.getElementById("bookDestination");
const sliderDots = document.getElementById("sliderDots");

let currentDestinationIndex = 0;

function showDestination(index) {
  const destination = destinations[index];

  destinationIcon.textContent = destination.icon;
  destinationName.textContent = destination.name;
  destinationDescription.textContent = destination.description;

  updateDots();
}

function nextSlide() {
  currentDestinationIndex++;

  if (currentDestinationIndex >= destinations.length) {
    currentDestinationIndex = 0;
  }

  showDestination(currentDestinationIndex);
}

function previousSlide() {
  currentDestinationIndex--;

  if (currentDestinationIndex < 0) {
    currentDestinationIndex = destinations.length - 1;
  }

  showDestination(currentDestinationIndex);
}

function createDots() {
  sliderDots.innerHTML = "";

  destinations.forEach(function (destination, index) {
    const dot = document.createElement("button");
    dot.classList.add("slider-dot");
    dot.setAttribute("aria-label", "Show " + destination.name);

    dot.addEventListener("click", function () {
      currentDestinationIndex = index;
      showDestination(currentDestinationIndex);
    });

    sliderDots.appendChild(dot);
  });

  updateDots();
}

function updateDots() {
  const dots = document.querySelectorAll(".slider-dot");

  dots.forEach(function (dot, index) {
    if (index === currentDestinationIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

prevDestination.addEventListener("click", previousSlide);
nextDestination.addEventListener("click", nextSlide);

bookDestination.addEventListener("click", function () {
  const selectedDestination = destinations[currentDestinationIndex];

  window.location.href = "booking.html?destination=" + selectedDestination.slug;
});

const homeLoginAction = document.getElementById("homeLoginAction");
const homeUser = JSON.parse(localStorage.getItem("travelMateUser"));

if (homeLoginAction && homeUser) {
  homeLoginAction.textContent = "Go to my profile";
  homeLoginAction.href = "profile.html";
}

createDots();
showDestination(currentDestinationIndex);
