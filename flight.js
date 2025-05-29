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
        // Store selected flight details for both segments
        if (journeyType === "round-trip") {
          // Arrays for both segments
          const flightNumbers = [selectedFlight.flightNumber, selectedReturnFlight.flightNumber];
          const departureTimes = [selectedFlight.departureTime, selectedReturnFlight.departureTime];
          const arrivalTimes = [selectedFlight.arrivalTime, selectedReturnFlight.arrivalTime];
          sessionStorage.setItem("flightNumbers", JSON.stringify(flightNumbers));
          sessionStorage.setItem("flightDepartureTimes", JSON.stringify(departureTimes));
          sessionStorage.setItem("flightArrivalTimes", JSON.stringify(arrivalTimes));
        } else {
          // Only one segment
          const flightNumbers = [selectedFlight.flightNumber];
          const departureTimes = [selectedFlight.departureTime];
          const arrivalTimes = [selectedFlight.arrivalTime];
          sessionStorage.setItem("flightNumbers", JSON.stringify(flightNumbers));
          sessionStorage.setItem("flightDepartureTimes", JSON.stringify(departureTimes));
          sessionStorage.setItem("flightArrivalTimes", JSON.stringify(arrivalTimes));
        }
        // Store selected cabin class
        sessionStorage.setItem("bookingCabinClass", cabinClass);
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
document.getElementById("flightForm").addEventListener("submit", function (event) {
      event.preventDefault();
      const from = document.getElementById("from").value.trim();
      const to = document.getElementById("to").value.trim();
      const departure = document.getElementById("departure").value;
      const returnDate = document.getElementById("return").value;
      const cabinClass = document.getElementById("cabinClass").value;
      const journeyType = document.getElementById("journeyType").value;
      // Example static flight data (replace with real selection logic if needed)
      const flightNumbers = ["AI2943"];
      const departureTimes = ["7:30 AM"];
      const arrivalTimes = ["9:35 AM"];
      sessionStorage.setItem("bookingCabinClass", cabinClass);
      sessionStorage.setItem("flightNumbers", JSON.stringify(flightNumbers));
            sessionStorage.setItem("flightDepartureTimes", JSON.stringify(departureTimes));
            sessionStorage.setItem("flightArrivalTimes", JSON.stringify(arrivalTimes));
      });

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

// Airport coordinates for distance calculation
const airportCoordinates = {
  DEL: { lat: 28.5665, lng: 77.1031 }, // Delhi
  BOM: { lat: 19.0896, lng: 72.8656 }, // Mumbai
  BLR: { lat: 13.1986, lng: 77.7066 }, // Bangalore
  MAA: { lat: 12.9941, lng: 80.1709 }, // Chennai
  CCU: { lat: 22.6520, lng: 88.4463 }, // Kolkata
  HYD: { lat: 17.2403, lng: 78.4294 }, // Hyderabad
  VNS: { lat: 25.4520, lng: 82.8593 }, // Varanasi
  LKO: { lat: 26.8467, lng: 80.9462 }, // Lucknow
  JAI: { lat: 26.8242, lng: 75.8120 }, // Jaipur
  AMD: { lat: 23.0225, lng: 72.5714 }  // Ahmedabad
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate base fare based on distance
function calculateBaseFare(fromAirport, toAirport) {
  const from = airportCoordinates[fromAirport];
  const to = airportCoordinates[toAirport];
  
  if (!from || !to) {
    throw new Error('Invalid airport code');
  }

  const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
  
  // Base rate per km varies with distance
  let ratePerKm;
  if (distance <= 500) {
    ratePerKm = 10; // Short routes
  } else if (distance <= 1000) {
    ratePerKm = 8;  // Medium routes
  } else {
    ratePerKm = 7;  // Long routes
  }

  return Math.round(distance * ratePerKm);
}

// Calculate final fare with all multipliers
function calculateFlightFare(params) {
  const {
    fromAirport,
    toAirport,
    cabinClass,
    bookingDaysInAdvance,
    isWeekend,
    isPeakSeason,
    passengers
  } = params;

  // Get base fare
  const baseFare = calculateBaseFare(fromAirport, toAirport);

  // Cabin class multipliers
  const classMultipliers = {
    economy: 1.0,
    premium_economy: 1.5,
    business: 2.5,
    first: 4.0
  };

  // Advance booking discounts (0-90 days)
  let advanceBookingMultiplier = 1.0;
  if (bookingDaysInAdvance >= 60) {
    advanceBookingMultiplier = 0.8;  // 20% discount
  } else if (bookingDaysInAdvance >= 30) {
    advanceBookingMultiplier = 0.9;  // 10% discount
  } else if (bookingDaysInAdvance <= 7) {
    advanceBookingMultiplier = 1.3;  // 30% premium
  }

  // Weekend and peak season multipliers
  const weekendMultiplier = isWeekend ? 1.1 : 1.0;
  const seasonMultiplier = isPeakSeason ? 1.2 : 1.0;

  // Calculate fare for one passenger
  let farePerPerson = Math.round(
    baseFare *
    classMultipliers[cabinClass] *
    advanceBookingMultiplier *
    weekendMultiplier *
    seasonMultiplier
  );

  // Add taxes and fees (18% GST + ₹500 airport charges)
  farePerPerson = Math.round(farePerPerson * 1.18 + 500);

  // Calculate total fare for all passengers
  const totalFare = farePerPerson * passengers;

  return {
    baseFare,
    farePerPerson,
    totalFare,
    taxes: Math.round(farePerPerson * 0.18),
    airportCharges: 500,
    discount: advanceBookingMultiplier < 1 ? Math.round((1 - advanceBookingMultiplier) * baseFare) : 0
  };
}

// Example airlines and their routes
const airlines = {
  AI: "Air India",
  UK: "Vistara",
  IN: "IndiGo",
  SG: "SpiceJet",
  GF: "Go First"
};

// Function to get available flights
function getAvailableFlights(params) {
  const {
    from,
    to,
    departureDate,
    returnDate,
    cabinClass = "economy",
    adults = 1,
    children = 0
  } = params;

  // Calculate days in advance for booking
  const today = new Date();
  const departureDay = new Date(departureDate);
  const bookingDaysInAdvance = Math.ceil((departureDay - today) / (1000 * 60 * 60 * 24));

  // Check if departure is on weekend
  const isWeekend = departureDay.getDay() === 0 || departureDay.getDay() === 6;

  // Check if it's peak season (example: December-January, May-June)
  const month = departureDay.getMonth();
  const isPeakSeason = [0, 1, 4, 5, 11].includes(month);

  // Calculate fares
  const fareParams = {
    fromAirport: from,
    toAirport: to,
    cabinClass,
    bookingDaysInAdvance,
    isWeekend,
    isPeakSeason,
    passengers: adults + children
  };

  try {
    const fares = calculateFlightFare(fareParams);

    // Generate flights with different timings and airlines
    const flights = [];
    const airlineKeys = Object.keys(airlines);
    
    // Morning flight
    flights.push({
      airlineName: airlines[airlineKeys[0]],
      flightNumber: `${airlineKeys[0]}${Math.floor(Math.random() * 1000)}`,
      departureTime: "06:00",
      arrivalTime: "08:30",
      departureAirportCode: from,
      arrivalAirportCode: to,
      fareType: cabinClass.replace("_", " ").toUpperCase(),
      price: Math.round(fares.totalFare * 0.95) // Morning discount
    });

    // Afternoon flight
    flights.push({
      airlineName: airlines[airlineKeys[1]],
      flightNumber: `${airlineKeys[1]}${Math.floor(Math.random() * 1000)}`,
      departureTime: "14:30",
      arrivalTime: "17:00",
      departureAirportCode: from,
      arrivalAirportCode: to,
      fareType: cabinClass.replace("_", " ").toUpperCase(),
      price: fares.totalFare
    });

    // Evening flight
    flights.push({
      airlineName: airlines[airlineKeys[2]],
      flightNumber: `${airlineKeys[2]}${Math.floor(Math.random() * 1000)}`,
      departureTime: "19:45",
      arrivalTime: "22:15",
      departureAirportCode: from,
      arrivalAirportCode: to,
      fareType: cabinClass.replace("_", " ").toUpperCase(),
      price: Math.round(fares.totalFare * 1.1) // Evening premium
    });

    // If round trip, generate return flights
    if (returnDate) {
      const returnFlights = [];
      const returnFareParams = {
        ...fareParams,
        fromAirport: to,
        toAirport: from
      };
      const returnFares = calculateFlightFare(returnFareParams);

      // Generate return flight options
      for (let i = 0; i < 3; i++) {
        const returnFlight = {
          airlineName: airlines[airlineKeys[i]],
          flightNumber: `${airlineKeys[i]}${Math.floor(Math.random() * 1000)}`,
          departureTime: ["07:30", "15:45", "20:30"][i],
          arrivalTime: ["10:00", "18:15", "23:00"][i],
          departureAirportCode: to,
          arrivalAirportCode: from,
          fareType: cabinClass.replace("_", " ").toUpperCase(),
          price: returnFares.totalFare
        };
        returnFlights.push(returnFlight);
      }

      // Create flight pairs for round trips
      const roundTripOptions = [];
      flights.forEach(outbound => {
        returnFlights.forEach(inbound => {
          roundTripOptions.push({
            outbound,
            inbound,
            totalPrice: outbound.price + inbound.price
          });
        });
      });

      return roundTripOptions;
    }

    return flights;
  } catch (error) {
    console.error('Error calculating fares:', error);
    return [];
  }
}
