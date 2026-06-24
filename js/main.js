const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const authLinks = document.getElementById("authLinks");

const currentUser = JSON.parse(localStorage.getItem("travelMateUser"));

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
  });
}

if (authLinks) {
  if (currentUser) {
    authLinks.innerHTML = `
      <a href="booking.html">Booking</a>
      <a href="itinerary.html">Itinerary</a>
      <a href="profile.html">Profile</a>
      <button class="logout-btn" id="logoutBtn">Logout</button>
    `;

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("travelMateUser");
      window.location.href = "index.html";
    });
  } else {
    authLinks.innerHTML = `
      <a href="login.html">Login</a>
    `;
  }
}