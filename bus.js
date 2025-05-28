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
// Set the minimum date for the departure busNameinput field
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  document.getElementById("departure").setAttribute("min", formattedDate);
});
document.addEventListener("DOMContentLoaded", function () {
  // Close modal when clicking the close button
  const closeModalBtn = document.getElementById("closeModal");
  const passengerModal = document.getElementById("passengerModal");
  if (closeModalBtn && passengerModal) {
    closeModalBtn.onclick = function () {
      passengerModal.style.display = "none";
    };
    // Optional: Close modal when clicking outside the modal content
    window.onclick = function (event) {
      if (event.target === passengerModal) {
        passengerModal.style.display = "none";
      }
    };
  }
});
// Handle form submission
document.getElementById("busForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get form values
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const departure = document.getElementById("departure").value;
  const adults = parseInt(document.getElementById("adults").value, 10);
  const children = parseInt(document.getElementById("children").value, 10);

  // Validate form inputs
  if (!from || !to || !departure) {
    alert("Please fill in all required fields.");
    return;
  }

  // Simulate fetching bus data
  fetchBusData(from, to, departure, adults, children);
});

// Function to simulate fetching bus data
function fetchBusData(from, to, departure, adults, children) {
  const cityDistances = {
    agra: { delhi: 200, mumbai: 1200, bangalore: 1800, chennai: 2100 },
    delhi: { agra: 200, mumbai: 1400, bangalore: 1700, chennai: 2200 },
    mumbai: { agra: 1200, delhi: 1400, bangalore: 980, chennai: 1330 },
    bangalore: { agra: 1800, delhi: 1700, mumbai: 980, chennai: 350 },
    chennai: { agra: 2100, delhi: 2200, mumbai: 1330, bangalore: 350 },
  };

  const distance = cityDistances[from]?.[to] || 0;

  if (distance === 0) {
    alert("No route available between the selected cities.");
    return;
  }

  const costPerKm = 2; // ₹2 per kilometer
  const adultFare = distance * costPerKm;
  const childFare = adultFare * 0.5; // Children pay 50% of the adult fare

  const busData = [
    {
      busName: "Express Bus",
      fare: adultFare,
      seatsAvailable: 20,
    },
    {
      busName: "Luxury Bus",
      fare: adultFare * 1.5,
      seatsAvailable: 10,
    },
    {
      busName: "Economy Bus",
      fare: adultFare * 0.8,
      seatsAvailable: 30,
    },
  ];

  displayBusData(busData);
}

// Function to display bus data
function displayBusData(busData) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (busData.length === 0) {
    resultsContainer.innerHTML =
      "<p>No buses available for the selected route.</p>";
    return;
  }

  busData.forEach((bus, index) => {
    const busCard = document.createElement("div");
    busCard.className = "bus-card";
    busCard.innerHTML = `
      <h3>${bus.busName}</h3>
      <p>Fare: ₹${bus.fare.toFixed(2)}</p>
      <p>Seats Available: ${bus.seatsAvailable}</p>
      <button class="btn btn-primary" onclick="openPassengerDetails(${index}, ${
      bus.fare
    })">Book Now</button>
    `;
    resultsContainer.appendChild(busCard);
  });
}

// Function to open passenger details modal
function openPassengerDetails(busIndex, fare) {
  const modal = document.getElementById("passengerModal");
  modal.style.display = "block";

  // Handle adding passenger details dynamically
  const passengerDetailsContainer = document.getElementById("passengerDetails");
  passengerDetailsContainer.innerHTML = ""; // Clear previous passenger details

  const adults = parseInt(document.getElementById("adults").value, 10);
  const children = parseInt(document.getElementById("children").value, 10);

  // Add input fields for each adult passenger
  for (let i = 1; i <= adults; i++) {
    passengerDetailsContainer.innerHTML += `
      <div class="passenger">
        <h4>Adult ${i}</h4>
        <label for="passengerName${i}">Name:</label>
        <input type="text" id="passengerName${i}" placeholder="Enter name" required>
        <label for="passengerAge${i}">Age:</label>
        <input type="number" id="passengerAge${i}" placeholder="Enter age" required>
        <label for="passengerSex${i}">Sex:</label>
        <select id="passengerSex${i}" required>
          <option value="" disabled selected>Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    `;
  }

  // Add input fields for each child passenger
  for (let i = 1; i <= children; i++) {
    passengerDetailsContainer.innerHTML += `
      <div class="passenger">
        <h4>Child ${i}</h4>
        <label for="childName${i}">Name:</label>
        <input type="text" id="childName${i}" placeholder="Enter name" required>
        <label for="childAge${i}">Age:</label>
        <input type="number" id="childAge${i}" placeholder="Enter age" required>
        <label for="childSex${i}">Sex:</label>
        <select id="childSex${i}" required>
          <option value="" disabled selected>Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
    `;
  }

  // Calculate total fare
  const totalFare = fare * adults + fare * 0.5 * children;
  document.getElementById("totalAmount").textContent = `₹${totalFare.toFixed(
    2
  )}`;

  // Handle booking confirmation
  document.getElementById("confirmBooking").onclick = function () {
    const passengerDetails = [];
    const passengerName = document.getElementById("passengerName").value;
    const passengerContact = document.getElementById("passengerContact").value;
    const passengerEmail = document.getElementById("passengerEmail").value;

    // Validate passenger details
    if (!passengerName) {
      alert("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(passengerContact)) {
      alert("Please enter a valid 10-digit contact number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passengerEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Validate and collect adult passenger details
    for (let i = 1; i <= adults; i++) {
      const name = document.getElementById(`passengerName${i}`).value;
      const age = document.getElementById(`passengerAge${i}`).value;
      const sex = document.getElementById(`passengerSex${i}`).value;

      if (!name || !age || !sex) {
        alert(`Please fill in all details for Adult ${i}.`);
        return;
      }

      passengerDetails.push({ name, age, sex });
    }

    // Validate and collect child passenger details
    for (let i = 1; i <= children; i++) {
      const name = document.getElementById(`childName${i}`).value;
      const age = document.getElementById(`childAge${i}`).value;
      const sex = document.getElementById(`childSex${i}`).value;

      if (!name || !age || !sex) {
        alert(`Please fill in all details for Child ${i}.`);
        return;
      }

      passengerDetails.push({ name, age, sex });
    }

    // ...inside document.getElementById("confirmBooking").onclick = function () { ... }
    localStorage.setItem("busBookingPassengerEmail", passengerEmail);
    // Collect main passenger details
    const mainPassenger = {
      name: passengerName,
      contact: passengerContact,
      email: passengerEmail,
    };

    // Collect route and booking info
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const departure = document.getElementById("departure").value;
    const selectedBus =
      document.querySelectorAll(".bus-card")[busIndex]?.querySelector("h3")
        ?.textContent || "";
    const totalFare = fare * adults + fare * 0.5 * children;

    // Generate random ticket number and PNR
    const ticketNo = "TCA" + Math.floor(100000000 + Math.random() * 900000000);
    const pnr = generatePNR();
    const seatNumbers = generateSeatNumbers(adults + children);

    // Save all booking details to localStorage
    localStorage.setItem("busBookingPassengerName", passengerName);
    localStorage.setItem("busBookingContact", passengerContact);
    localStorage.setItem("busBookingEmail", passengerEmail);
    localStorage.setItem(
      "busBookingPassengers",
      JSON.stringify(passengerDetails)
    );
    localStorage.setItem(
      "busBookingRoute",
      `${capitalize(from)} to ${capitalize(to)}`
    );
    localStorage.setItem("busBookingDate", formatDate(departure));
    localStorage.setItem("busBookingOperator", selectedBus);
    localStorage.setItem("busBookingFare", totalFare);
    localStorage.setItem("busBookingTicketNo", ticketNo);
    localStorage.setItem("busBookingPNR", pnr);
    localStorage.setItem("busBookingSeats", seatNumbers);
    localStorage.setItem("busName", selectedBus);
    localStorage.setItem("busBookingReportingTime", "09:45 PM");
    localStorage.setItem("busBookingDepartureTime", "10:00 PM");

    // Redirect to confirmation page
    window.location.href = "busconfirmation.html";

    // Helper functions
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function generatePNR() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let pnr = "";
      for (let i = 0; i < 12; i++) {
        pnr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pnr;
    }
    function generateSeatNumbers(count) {
      // Generate random seat numbers as a comma-separated string
      let seats = [];
      let used = {};
      while (seats.length < count) {
        let seat = Math.floor(Math.random() * 40) + 1;
        if (!used[seat]) {
          seats.push(seat);
          used[seat] = true;
        }
      }
      return seats.join(",");
    }
    function formatDate(dateStr) {
      // Format date as "Day, Month DD, YYYY"
      const date = new Date(dateStr);
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString("en-US", options);
    }
  };
}
