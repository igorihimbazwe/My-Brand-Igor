// Login Form Submission
async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const response = await fetch(
      "https://my-brand-api-6my7.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );
    // const data = await response.json();

    // Handle login response
    if (response.ok) {
      const { token } = await response.json();

      // Store the token in localStorage
      localStorage.setItem("token", token);
      window.location.href = "dash/index.html";
    } else {
      // Handle login error
      console.error("Login failed:", data.message || "Unknown error");
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert(
      "An unexpected error occurred. Please Check your password and email or try again later."
    );
  }
}

document
  .getElementById("loginForm")
  .addEventListener("submit", handleLoginSubmit);

// Signup Form Submission
document
  .getElementById("signupForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const firstName = document.getElementById("signupFirstName").value;
    const lastName = document.getElementById("signupLastName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById(
      "signupConfirmPassword"
    ).value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://my-brand-api-6my7.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email, password }),
        }
      );
      const data = await response.json();

      // Handle signup response
      if (response.ok) {
        // Redirect to dash/index.html
        // window.location.href = "dash/index.html";
      } else {
        // Handle signup error
        console.error("Signup failed:", data.message || "Unknown error");
        alert("Signup failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  });

// Show signup form when SIGNUP button is clicked
document
  .getElementById("signupLink")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    document
      .getElementById("loginForm")
      .removeEventListener("submit", handleLoginSubmit);
  });

// Contacts Form Submission
document
  .getElementById("contacts-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email-input").value;
    const message = document.getElementById("message-input").value;

    try {
      const response = await fetch(
        "https://my-brand-api-6my7.onrender.com/api/message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fullName, email, message }),
        }
      );
      const data = await response.json();

      // Handle contact form response
      if (response.ok) {
        alert("Message sent successfully!");
        // Optionally, reset the form after successful submission
        document.getElementById("contacts-form").reset();
      } else {
        // Handle contact form error
        console.error(
          "Failed to send message:",
          data.message || "Unknown error"
        );
        alert("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An unexpected error occurred. Please try again later.");
    }
  });
