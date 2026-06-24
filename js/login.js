const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const formMessage = document.getElementById("formMessage");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    clearMessages();

    let isValid = true;

    if (username === "") {
      usernameError.textContent = "Username is required";
      isValid = false;
    }

    if (password === "") {
      passwordError.textContent = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      passwordError.textContent = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!isValid) {
      formMessage.textContent = "Please fix the errors before continuing.";
      formMessage.classList.add("error");
      return;
    }

    const user = {
      username: username,
      loginTime: new Date().toLocaleString()
    };

    localStorage.setItem("travelMateUser", JSON.stringify(user));

    formMessage.textContent = "Login successful! Redirecting to the home page...";
    formMessage.classList.add("success");

    setTimeout(function () {
      window.location.href = "index.html";
    }, 1000);
  });
}

function clearMessages() {
  usernameError.textContent = "";
  passwordError.textContent = "";
  formMessage.textContent = "";

  formMessage.classList.remove("success");
  formMessage.classList.remove("error");
}