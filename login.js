document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // Retrieve stored credentials from local storage
    const storedEmail = localStorage.getItem("userEmail");
    const storedPassword = localStorage.getItem("userPassword");

    // Validate credentials
    if (email === storedEmail && password === storedPassword) {
      // Fetch user info from localStorage and set in sessionStorage
      const fullName = localStorage.getItem("userFullName");
      const dob = localStorage.getItem("userDob");
      const mobile = localStorage.getItem("userMobile");
      const gender = localStorage.getItem("userGender");

      sessionStorage.setItem("fullName", fullName);
      sessionStorage.setItem("email", email);
      sessionStorage.setItem("dob", dob);
      sessionStorage.setItem("mobile", mobile);
      sessionStorage.setItem("gender", gender);

      alert("Login successful! Redirecting to the homepage...");
      window.location.href = "after-login.html"; // Redirect to the homepage
    } else {
      alert("Invalid email or password. Please try again.");
    }
  });
