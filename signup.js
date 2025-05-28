document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const dob = document.getElementById("dob").value;
    const mobile = document.getElementById("mobile").value.trim();
    const gender = document.getElementById("gender").value;

    // Validate passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    // Validate DOB is not in the future
    const today = new Date().toISOString().split('T')[0];
    if (dob > today) {
      alert("Date of Birth cannot be in the future.");
      return;
    }

    // Save user credentials to local storage
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPassword", password);
    localStorage.setItem("userFullName", fullName);
    localStorage.setItem("userDob", dob);
    localStorage.setItem("userMobile", mobile);
    localStorage.setItem("userGender", gender);

    alert(`Welcome, ${fullName}! Your account has been created.`);
    window.location.href = "login.html"; // Redirect to the login page
  });

document.addEventListener('DOMContentLoaded', function () {
  // Set max date for DOB input to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dob').setAttribute('max', today);

  // Set custom validation message for mobile number
  document.getElementById("mobile").addEventListener("input", function () {
    const mobileInput = this;
    const pattern = /^[0-9]{10}$/;
    if (!pattern.test(mobileInput.value)) {
      mobileInput.setCustomValidity("Please enter 10-digit mobile number");
    } else {
      mobileInput.setCustomValidity("");
    }
  });
  document.getElementById("fullName").addEventListener("input", function () {
  const nameInput = this;
  const pattern = /^[A-Za-z\s]+$/;
  if (!pattern.test(nameInput.value)) {
    nameInput.setCustomValidity("Please enter alphabets only");
  } else {
    nameInput.setCustomValidity("");
  }
});

});
