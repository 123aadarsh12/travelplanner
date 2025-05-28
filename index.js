// Show initial letter of user name on Dashboard button
document.addEventListener("DOMContentLoaded", function () {
  let initial = "D";
  const name =
    sessionStorage.getItem("fullName") || localStorage.getItem("userFullName");
  if (name && name.trim().length > 0) {
    initial = name.trim()[0].toUpperCase();
  }
  document.getElementById("dashboard-initial").textContent = initial;
});
// Get reference to the form
const travelForm = document.getElementById("travelForm");

function logout() {
  sessionStorage.clear();
  alert("You have been logged out.");
  window.location.href = "login.html";
}

// Set minimum dates for departure and return inputs
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date().toISOString().split("T")[0];
  const departureInput = document.getElementById("departure");
  const returnInput = document.getElementById("return");

  // Set the minimum date for departure to today
  departureInput.setAttribute("min", today);

  // Update the minimum date for return when departure date changes
  departureInput.addEventListener("change", function () {
    const departureDate = departureInput.value;
    returnInput.setAttribute("min", departureDate);
  });

  // Set the minimum date for return to today by default
  returnInput.setAttribute("min", today);
});

// Add event listener for form submission
travelForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Get form values
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const departure = document.getElementById("departure").value;
  const returnDate = document.getElementById("return").value;
  const adults = document.getElementById("adults").value;
  const children = document.getElementById("children").value;

  // Validate form inputs
  if (!from || !to || !departure || !returnDate) {
    alert("Please fill in all required fields.");
    return;
  }

  // Check if Origin and Destination are the same
  if (from === to) {
    alert(
      "Origin and Destination cities cannot be the same. Please select different cities."
    );
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  if (departure < today) {
    alert("Departure date cannot be in the past.");
    return;
  }

  if (returnDate < departure) {
    alert("Return date cannot be earlier than the departure date.");
    return;
  }

  // Redirect to the destination page with query parameters
  const queryParams = `from=${from}&to=${to}&departure=${departure}&return=${returnDate}&adults=${adults}&children=${children}`;
  window.location.href = `destination.html?${queryParams}`;
});
