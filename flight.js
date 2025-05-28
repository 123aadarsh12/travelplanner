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

// Toggle the visibility of the return date field based on journey type
function toggleReturnDate() {
  const journeyType = document.getElementById("journeyType").value;
  const returnDateGroup = document.getElementById("returnDateGroup");
  if (journeyType === "round-trip") {
    returnDateGroup.style.display = "block";
  } else {
    returnDateGroup.style.display = "none";
    document.getElementById("return").value = "";
  }
}

// Set minimum and maximum dates for departure and return inputs
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 365);

  const formattedToday = today.toISOString().split("T")[0];
  const formattedMaxDate = maxDate.toISOString().split("T")[0];

  const departureInput = document.getElementById("departure");
  const returnInput = document.getElementById("return");

  departureInput.setAttribute("min", formattedToday);
  departureInput.setAttribute("max", formattedMaxDate);
  returnInput.setAttribute("min", formattedToday);
  returnInput.setAttribute("max", formattedMaxDate);

  // Update return date's minimum based on departure date
  departureInput.addEventListener("change", (event) => {
    const departureDate = event.target.value;
    if (departureDate) {
      returnInput.setAttribute("min", departureDate);
      returnInput.removeAttribute("disabled");
    } else {
      returnInput.setAttribute("min", formattedToday);
      returnInput.setAttribute("disabled", "true");
    }
  });

  // Handle trip type selection
  const journeyTypeSelect = document.getElementById("journeyType");
  journeyTypeSelect.addEventListener("change", (event) => {
    if (event.target.value === "round-trip") {
      returnInput.removeAttribute("disabled");
      document.getElementById("returnDateGroup").style.display = "block";
    } else {
      returnInput.setAttribute("disabled", "true");
      returnInput.value = "";
      document.getElementById("returnDateGroup").style.display = "none";
    }
  });
});

// Utility: Format money
function formatINR(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

// Function to render user summary and result cards
function showFlightResultsWithSummary(
  {
    from,
    to,
    departure,
    returnDate,
    cabinClass,
    journeyType,
    adults,
    children,
  },
  flights
) {
  const resultsDiv = document.getElementById("flight-results");

  // Map airport codes to names for display
  const airportNames = {
    DEL: "Delhi (DEL)",
    BOM: "Mumbai (BOM)",
    BLR: "Bangalore (BLR)",
    MAA: "Chennai (MAA)",
    CCU: "Kolkata (CCU)",
  };

  let summaryHtml = `
  <div class="booking-search-summary" style="background:#f7fafc;border-radius:12px;padding:18px 22px;margin-bottom:24px;">
    <b>Journey Type:</b> ${
      journeyType === "round-trip" ? "Round Trip" : "One Way"
    } &nbsp; 
    <b>From:</b> ${airportNames[from] || from || "-"} &nbsp; 
    <b>To:</b> ${airportNames[to] || to || "-"} &nbsp; 
    <b>Departure:</b> ${departure || "-"}
    ${returnDate ? `&nbsp; <b>Return:</b> ${returnDate}` : ""}
    &nbsp; <b>Cabin Class:</b> ${
      cabinClass
        ? cabinClass[0].toUpperCase() + cabinClass.slice(1).replace("_", " ")
        : "-"
    }
    &nbsp;<b>Adults:</b> ${adults} &nbsp; <b>Children:</b> ${children}
  </div>
`;

  if (!flights || flights.length === 0) {
    resultsDiv.innerHTML =
      summaryHtml + "<p>No flights found for your selection.</p>";
    return;
  }

  let html = `<div class="bookingcom-style-results">`;

  if (journeyType === "round-trip") {
    // flights is array of {outbound, inbound, totalPrice}
    flights.forEach((pair) => {
      html += `
        <div class="flight-card">
          <div><b>Outbound:</b></div>
          <div class="flight-airline-name">${pair.outbound.airlineName} (${
        pair.outbound.flightNumber
      })</div>
          <div>${pair.outbound.departureTime} ${
        pair.outbound.departureAirportCode
      } → ${pair.outbound.arrivalTime} ${pair.outbound.arrivalAirportCode}</div>
          <div>${pair.outbound.fareType}</div>
          <hr>
          <div><b>Return:</b></div>
          <div class="flight-airline-name">${pair.inbound.airlineName} (${
        pair.inbound.flightNumber
      })</div>
          <div>${pair.inbound.departureTime} ${
        pair.inbound.departureAirportCode
      } → ${pair.inbound.arrivalTime} ${pair.inbound.arrivalAirportCode}</div>
          <div>${pair.inbound.fareType}</div>
          <div style="margin-top:10px;font-weight:bold;">Total Price: ${formatINR(
            pair.totalPrice
          )}</div>
          <button class="btn btn-primary btn-details">View details</button>
        </div>
      `;
    });
  } else {
    // One way: show all outbound flights
    flights.forEach((f) => {
      html += `
        <div class="flight-card">
          <div class="flight-airline-name">${f.airlineName} (${
        f.flightNumber
      })</div>
          <div>${f.departureTime} ${f.departureAirportCode} → ${
        f.arrivalTime
      } ${f.arrivalAirportCode}</div>
          <div>${f.fareType}</div>
          <div style="margin-top:10px;font-weight:bold;">Price: ${formatINR(
            f.price
          )}</div>
          <button class="btn btn-primary btn-details">View details</button>
        </div>
      `;
    });
  }

  html += `</div>`;
  resultsDiv.innerHTML = summaryHtml + html;
  // ...existing code...
  document.querySelectorAll(".btn-details").forEach((btn, idx) => {
    btn.addEventListener("click", function () {
      const proceed = confirm("Proceed for booking?");
      if (proceed) {
        // For round-trip, get the correct pair; for one-way, get the correct flight
        let selectedFlight, selectedReturnFlight, totalPrice;
        if (journeyType === "round-trip") {
          const pair = flights[idx];
          selectedFlight = pair.outbound;
          selectedReturnFlight = pair.inbound;
          totalPrice = pair.totalPrice;
        } else {
          selectedFlight = flights[idx];
          totalPrice = selectedFlight.price;
        }

        // Store all details for booking page
        sessionStorage.setItem("bookingAdults", adults);
        sessionStorage.setItem("bookingChildren", children);
        sessionStorage.setItem("bookingFrom", from);
        sessionStorage.setItem("bookingTo", to);
        sessionStorage.setItem("bookingJourneyType", journeyType);
        sessionStorage.setItem("bookingDeparture", departure);
        sessionStorage.setItem("bookingReturn", returnDate || "");
        sessionStorage.setItem("bookingFare", totalPrice);
        // Optionally store flight numbers, times, etc.

        window.location.href = "flightbooking.html";
      }
    });
  });
}

// Static flight data (from your screenshot)
function getStaticFlightResults(
  from,
  to,
  journeyType,
  cabinClass,
  adults,
  children
) {
  // Example static flights
  const flights = [
    {
      airlineLogoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
      airlineName: "Air India",
      flightNumber: "AI-101",
      departureTime: "08:00 AM",
      departureAirportCode: from,
      arrivalTime: "10:15 AM",
      arrivalAirportCode: to,
      duration: "2h 15m",
      stops: 0,
      fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
      price: getFare(to, from, cabinClass, adults, children),
    },
    {
      airlineLogoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
      airlineName: "Air India",
      flightNumber: "AI-202",
      departureTime: "11:40 AM",
      departureAirportCode: from,
      arrivalTime: "1:55 PM",
      arrivalAirportCode: to,
      duration: "2h 15m",
      stops: 0,
      fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
      price: getFare(to, from, cabinClass, adults, children),
    },
    {
      airlineLogoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
      airlineName: "Air India",
      flightNumber: "AI-303",
      departureTime: "4:00 PM",
      departureAirportCode: from,
      arrivalTime: "6:15 PM",
      arrivalAirportCode: to,
      duration: "2h 15m",
      stops: 0,
      fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
      price: getFare(to, from, cabinClass, adults, children),
    },
  ];

  // For round-trip, pair each outbound with a return flight
  if (journeyType === "round-trip") {
    const returnFlights = [
      {
        airlineLogoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
        airlineName: "Air India",
        flightNumber: "AI-104",
        departureTime: "09:00 AM",
        departureAirportCode: to,
        arrivalTime: "11:15 AM",
        arrivalAirportCode: from,
        duration: "2h 15m",
        stops: 0,
        fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
        price: getFare(to, from, cabinClass, adults, children),
      },
      {
        airlineLogoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
        airlineName: "Air India",
        flightNumber: "AI-205",
        departureTime: "2:40 PM",
        departureAirportCode: to,
        arrivalTime: "4:55 PM",
        arrivalAirportCode: from,
        duration: "2h 15m",
        stops: 0,
        fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
        price: getFare(to, from, cabinClass, adults, children),
      },
      {
        airlineLogoUrl:
          "https://upload.wikimedia.org/wikipedia/commons/3/3e/Air_India_Logo.svg",
        airlineName: "Air India",
        flightNumber: "AI-306",
        departureTime: "7:00 PM",
        departureAirportCode: to,
        arrivalTime: "9:15 PM",
        arrivalAirportCode: from,
        duration: "2h 15m",
        stops: 0,
        fareType: "Eco Value fare: personal item, carry-on bag, checked bag",
        price: getFare(to, from, cabinClass, adults, children),
      },
    ];

    // Combine outbound and return flights as pairs
    const combined = [];
    for (let i = 0; i < flights.length; i++) {
      combined.push({
        outbound: flights[i],
        inbound: returnFlights[i],
        totalPrice: flights[i].price + returnFlights[i].price,
      });
    }
    return combined;
  }

  return flights;
}

function getFare(from, to, cabinClass, adults = 1, children = 0) {
  let baseFare = 9000;
  if ((from === "DEL" && to === "BOM") || (from === "BOM" && to === "DEL")) {
    baseFare = 9645;
  }
  if ((from === "DEL" && to === "BLR") || (from === "BLR" && to === "DEL")) {
    baseFare = 10500;
  }
  if ((from === "DEL" && to === "MAA") || (from === "MAA" && to === "DEL")) {
    baseFare = 11200;
  }

  // Cabin class multiplier
  let multiplier = 1;
  if (cabinClass === "premium_economy") multiplier = 1.5;
  else if (cabinClass === "business") multiplier = 2.5;
  else if (cabinClass === "first") multiplier = 4;

  // Fare calculation: adults full price, children 60% price
  const adultFare = Math.round(baseFare * multiplier) * adults;
  const childFare = Math.round(baseFare * multiplier * 0.6) * children;
  return adultFare + childFare;
}
// On form submit: fetch user input, show static results and summary
document
  .getElementById("flightForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    console.log("FROM:", from, "TO:", to);
    const departure = document.getElementById("departure").value;
    const returnDate = document.getElementById("return").value;
    const cabinClass = document.getElementById("cabinClass").value;
    const journeyType = document.getElementById("journeyType").value;
    const adults = parseInt(document.getElementById("adults").value, 10) || 1;
    const children =
      parseInt(document.getElementById("children").value, 10) || 0;

    // Optionally validate input
    if (!from || !to || !departure) {
      alert("Please fill in all required fields.");
      return;
    }
    if (from === to) {
      alert("Origin and destination cannot be the same.");
      return;
    }
    if (journeyType === "round-trip" && !returnDate) {
      alert("Please select a return date for round-trip.");
      return;
    }

    // Show static results with user input summary
    showFlightResultsWithSummary(
      {
        from,
        to,
        departure,
        returnDate,
        cabinClass,
        journeyType,
        adults,
        children,
      },
      getStaticFlightResults(
        from,
        to,
        journeyType,
        cabinClass,
        adults,
        children
      )
    );
  });
