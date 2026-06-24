# TravelMate

TravelMate is a simple travel planner web application built with HTML, CSS and vanilla JavaScript.

The goal of the project was to create a small multi-page website where users can search destinations, save places, plan trips and create booking requests. The app does not use a real backend, so user data is saved in the browser with `localStorage`.

This project was developed for a Web Development university course.

---

## Main Features

- Responsive multi-page layout
- Simulated login system
- Dynamic navigation based on login status
- Destination search using an external API
- Current weather information for searched destinations
- Saved destinations
- Personal itinerary creation
- Booking request form with live preview
- User profile with saved travel data
- Form validation with JavaScript
- Data saved with `localStorage`

---

## Pages

The project includes the following pages:

- `index.html` - Home page with a destination slider and project introduction
- `login.html` - Simulated login page
- `destinations.html` - Search destinations and view weather data
- `profile.html` - User profile and personal dashboard
- `itinerary.html` - Saved destinations and planned trips
- `booking.html` - Travel booking request form

The "How it works" link in the navbar points to a section inside the Home page instead of opening a separate About page. I chose this because the explanation is short and it keeps the navigation simpler.

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- localStorage
- Responsive design with media queries

---

## APIs Used

### Nominatim / OpenStreetMap

Used to search for destinations such as cities, countries and places.

The app uses the returned data to display information like:

- destination name
- country
- region
- latitude and longitude
- place type

### Open-Meteo

Used to show current weather information for a selected destination.

The app uses latitude and longitude from the destination result to get:

- temperature
- wind speed
- weather condition

### FlagCDN

Used to show country flag images when a country code is available.

---

## JavaScript Overview

### `main.js`

Used on all pages. It controls the mobile menu, updates the navbar depending on the login status and handles logout.

### `home.js`

Controls the Home page slider and redirects the user to the Booking page with the selected destination.

### `login.js`

Validates the login form and saves a simulated user in `localStorage`.

### `destinations.js`

Handles destination search, API requests, weather data and saving destinations.

### `profile.js`

Loads user information and shows saved destinations, planned trips and bookings in the profile dashboard.

### `itinerary.js`

Loads saved destinations, validates the itinerary form and saves planned trips.

### `booking.js`

Validates the booking form, updates the live preview and saves booking requests.

---

## localStorage

The project uses `localStorage` to simulate persistent data.

Main keys used:

- `travelMateUser`
- `travelMateProfile`
- `travelMateSavedDestinations`
- `travelMatePlannedTrips`
- `travelMateBookings`

Since `localStorage` stores only strings, the project uses `JSON.stringify()` when saving objects or arrays and `JSON.parse()` when reading them.

---

## Form Validation

The project includes several validated forms:

- Login form
- Profile form
- Destination search form
- Itinerary form
- Booking form

Validation is done with JavaScript using `event.preventDefault()`, custom error messages and simple checks such as required fields, minimum length, date validation and number ranges.

---

## Protected Pages

Some pages require the user to be logged in:

- Profile
- Itinerary
- Booking

If the user is not logged in, the page displays an "Access denied" message and a link to the Login page.

This is handled by checking whether `travelMateUser` exists in `localStorage`.

---

## Responsive Design

The layout is responsive and adapts to smaller screens.

The CSS uses:

- Flexbox
- media queries
- a mobile navigation menu
- stacked layouts on tablet and mobile

Main breakpoints:

```css
@media (max-width: 980px)
@media (max-width: 480px)
```

---

## How to Run the Project

The project is a static frontend website.

Recommended way:

1. Open the project folder in Visual Studio Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Choose **Open with Live Server**.

It can also be opened directly in the browser, but Live Server is recommended.

---

## Suggested Test Flow

1. Open the Home page.
2. Try the destination slider.
3. Go to the Destinations page.
4. Search for a destination, for example Rome or Tokyo.
5. Click "Show weather".
6. Try saving a destination without logging in.
7. Login using any username and a password with at least 6 characters.
8. Save a destination.
9. Create a trip in the Itinerary page.
10. Create a booking request in the Booking page.
11. Open the Profile page and check the dashboard.
12. Logout.

---

## Project Structure

```
travelmate/ 
├── index.html
├── login.html
├── profile.html
├── destinations.html
├── itinerary.html
├── booking.html
├── assets/
│   └── images/
│       └── logo.svg
├── css/
│   └── style.css
└── js/
    ├── main.js
    ├── home.js
    ├── login.js
    ├── profile.js
    ├── destinations.js
    ├── itinerary.js
    └── booking.js
```

---

## Notes

This is a frontend-only project. The login and booking systems are simulated and do not connect to a real backend or database.

The main objective was to demonstrate HTML structure, CSS styling, responsive design, JavaScript interactivity, form validation, API usage and browser storage.

---

## Author

Gabriele Rotundo

Web Development EPICODE Project - 2026