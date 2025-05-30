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
function showFlightResultsWithSummary(params, flights) {
  const {
    from,
    to,
    departure,
    returnDate,
    cabinClass,
    journeyType,
    adults,
    children,
  } = params;
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
      } → ${pair.inbound.arrivalTime} ${pair.inbound.arrivalAirportCode}</div>          <div>${pair.inbound.fareType}</div>
          <div class="fare-details">
            <div style="margin-top:10px;font-weight:600;">Fare Breakdown:</div>
            <div>Base Fare: ${formatINR(pair.outbound.fareBreakdown.baseFare + pair.inbound.fareBreakdown.baseFare)}</div>
            <div>Taxes & Fees: ${formatINR(
              pair.outbound.fareBreakdown.totalTaxesAndFees + pair.inbound.fareBreakdown.totalTaxesAndFees
            )}</div>
            ${pair.totalDiscount > 0 ? 
              `<div style="color:#0a0;">You save: ${formatINR(pair.totalDiscount)}</div>` : ''
            }
            <div style="margin-top:8px;font-weight:bold;font-size:1.1em;">Total Price: ${formatINR(
              pair.totalPrice
            )}</div>
            <div style="color:#666;font-size:0.9em;">*Price includes all taxes and fees</div>
          </div>
          <button class="btn btn-primary btn-details">Select Flight</button>
        </div>
      `;
    });
  } else {
    // One way: show all outbound flights
    flights.forEach((f) => {      const duration = calculateFlightDuration(f.departureAirportCode, f.arrivalAirportCode);
      html += `
        <div class="flight-card">          <div class="flight-airline-name">
            ${f.airlineName} (${f.flightNumber})
            ${f.isCodeshare ? 
              `<div style="font-size: 0.9em; color: #666;">Operated by ${airlines[f.operatedBy]}</div>` 
              : ''}
          </div>
          <div class="flight-time">
            <strong>${f.departureTime}</strong> ${f.departureAirportCode} → 
            <strong>${f.arrivalTime}</strong> ${f.arrivalAirportCode}
          </div>
          <div class="flight-duration">Duration: ${duration}</div>
          <div class="flight-fare-details">
            <div>${f.fareType}</div>
            <div class="fare-breakdown">
              <div>Base Fare: ${formatINR(f.fareBreakdown.baseFare)}</div>
              <div>Taxes & Fees: ${formatINR(f.fareBreakdown.totalTaxesAndFees)}</div>
              ${f.discount > 0 ? 
                `<div style="color: #0a0">You save: ${formatINR(f.discount)}</div>`
                : ''}
            </div>
            <div class="fare-amount">Total: ${formatINR(f.price)}</div>
            <div style="font-size: 0.9em; color: #666;">
              *Includes all taxes and charges
            </div>
          </div>
          <button class="btn btn-primary btn-details">Select Flight</button>
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

// Generate flight results using the fare calculation system
function getStaticFlightResults(from, to, journeyType, cabinClass, adults, children) {
  const departureDate = document.getElementById("departure").value;
  const returnDate = document.getElementById("return").value;
  
  const params = {
    from,
    to,
    departureDate,
    returnDate: journeyType === "round-trip" ? returnDate : null,
    cabinClass,
    adults,
    children
  };

  return getAvailableFlights(params);
}
document.getElementById("flightForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const departure = document.getElementById("departure").value;
    const returnDate = document.getElementById("return").value;
    const cabinClass = document.getElementById("cabinClass").value;
    const journeyType = document.getElementById("journeyType").value;
    const adults = parseInt(document.getElementById("adults").value, 10) || 1;
    const children = parseInt(document.getElementById("children").value, 10) || 0;

    // Basic validation
    if (!from || !to || !departure) {
        alert("Please fill in all required fields.");
        return;
    }
    if (from === to) {
        alert("Origin and destination cannot be the same.");
        return;
    }
    if (journeyType === "round-trip" && !returnDate) {
        alert("Please select a return date for round trip.");
        return;
    }

    try {
        // Calculate flight details using our fare calculation system
        const params = {
            from: from,
            to: to,
            departureDate: departure,
            returnDate: journeyType === "round-trip" ? returnDate : null,
            cabinClass: cabinClass,
            adults: adults,
            children: children
        };

        const flights = getAvailableFlights(params);
        
        if (flights && flights.length > 0) {
            // Show results in the UI
            showFlightResultsWithSummary({
                from,
                to,
                departure,
                returnDate,
                cabinClass,
                journeyType,
                adults,
                children
            }, flights);

            // Store basic info in session
            sessionStorage.setItem("bookingFrom", from);
            sessionStorage.setItem("bookingTo", to);
            sessionStorage.setItem("bookingDeparture", departure);
            sessionStorage.setItem("bookingReturn", returnDate || "");
            sessionStorage.setItem("bookingCabinClass", cabinClass);
            sessionStorage.setItem("bookingAdults", adults);
            sessionStorage.setItem("bookingChildren", children);
            
            // Show the results section
            document.getElementById("flight-results").style.display = "block";
        } else {
            alert("No flights found for the selected route and dates.");
        }
    } catch (error) {
        console.error("Error calculating flight fares:", error);
        alert("Unable to find flights for this route. Please try again.");
    }
});

// Calculate estimated duration based on distance
function calculateFlightDuration(fromAirport, toAirport) {
  const from = airportCoordinates[fromAirport];
  const to = airportCoordinates[toAirport];
  
  if (!from || !to) {
    return "2h 00m"; // Default duration if coordinates not found
  }

  const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
  // Assume average speed of 800 km/h including takeoff and landing
  const hours = Math.floor(distance / 800);
  const minutes = Math.round((distance / 800 % 1) * 60);
  return `${hours}h ${minutes}m`;
}
// No duplicate event listener needed since we already have one above

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

// Calculate base fare based on distance with enhanced tiered pricing
function calculateBaseFare(fromAirport, toAirport) {
  const from = airportCoordinates[fromAirport];
  const to = airportCoordinates[toAirport];
  
  if (!from || !to) {
    throw new Error('Invalid airport code');
  }

  const distance = calculateDistance(from.lat, from.lng, to.lat, to.lng);
  
  // Enhanced tiered rate per km based on distance ranges
  let ratePerKm;
  if (distance <= 300) {
    ratePerKm = 15;  // Very short routes (high fixed costs per km)
  } else if (distance <= 500) {
    ratePerKm = 12;  // Short routes
  } else if (distance <= 1000) {
    ratePerKm = 9;   // Medium routes
  } else if (distance <= 2000) {
    ratePerKm = 7;   // Long routes
  } else {
    ratePerKm = 6;   // Very long routes (economies of scale)
  }

  // Calculate base fare with minimum fare threshold
  const minBaseFare = 2500; // Minimum base fare for any flight
  const calculatedFare = Math.round(distance * ratePerKm);
  return Math.max(calculatedFare, minBaseFare);
}

// Calculate final fare with all multipliers
function calculateFlightFare(params = {}) {
  const {
    fromAirport,
    toAirport,
    cabinClass = 'economy',
    bookingDaysInAdvance = 0,
    isWeekend = false,
    isPeakSeason = false,
    passengers = 1,
    timeOfDay = 'standard'
  } = params;

  // Get base fare
  const baseFare = calculateBaseFare(fromAirport, toAirport);

  // Enhanced cabin class multipliers
  const classMultipliers = {
    economy: 1.0,
    premium_economy: 1.6,
    business: 2.8,
    first: 4.5
  };

  // Advance booking discounts
  let advanceBookingMultiplier;
  if (bookingDaysInAdvance >= 90) {
    advanceBookingMultiplier = 0.7;  // 30% discount for very early booking
  } else if (bookingDaysInAdvance >= 60) {
    advanceBookingMultiplier = 0.8;  // 20% discount for early booking
  } else if (bookingDaysInAdvance >= 30) {
    advanceBookingMultiplier = 0.9;  // 10% discount for moderate advance booking
  } else if (bookingDaysInAdvance >= 14) {
    advanceBookingMultiplier = 1.0;  // Standard fare
  } else if (bookingDaysInAdvance >= 7) {
    advanceBookingMultiplier = 1.2;  // 20% premium for late booking
  } else if (bookingDaysInAdvance >= 3) {
    advanceBookingMultiplier = 1.4;  // 40% premium for very late booking
  } else {
    advanceBookingMultiplier = 1.6;  // 60% premium for last-minute booking
  }

  // Weekend and peak season multipliers
  const weekendMultiplier = isWeekend ? 1.25 : 1.0;  // 25% premium for weekends
  const seasonMultiplier = isPeakSeason ? 1.35 : 1.0; // 35% premium for peak season

  // Time of day pricing
  const timeMultipliers = {
    morning: 0.9,  // 10% discount for early morning flights
    peak: 1.2,     // 20% premium for peak hours
    night: 0.85,   // 15% discount for late night flights
    standard: 1.0  // Standard price for other times
  };

  // Calculate base fare per person with all multipliers
  let farePerPerson = Math.round(
    baseFare *
    classMultipliers[cabinClass] *
    advanceBookingMultiplier *
    weekendMultiplier *
    seasonMultiplier *
    timeMultipliers[timeOfDay]
  );

  // Calculate taxes and fees
  const gst = Math.round(farePerPerson * 0.18); // 18% GST
  const airportCharges = 850; // Base airport charges
  const fuelSurcharge = Math.round(calculateDistance(
    airportCoordinates[fromAirport].lat,
    airportCoordinates[fromAirport].lng,
    airportCoordinates[toAirport].lat,
    airportCoordinates[toAirport].lng
  ) * 0.5); // Distance-based fuel surcharge
  const userDevelopmentFee = 350; // Airport development fee
  const passengerServiceFee = 300; // Passenger service fee

  // Add all charges to fare
  farePerPerson = Math.round(farePerPerson + gst + airportCharges + fuelSurcharge + userDevelopmentFee + passengerServiceFee);

  // Calculate total fare for all passengers
  const totalFare = farePerPerson * passengers;

  // Calculate any applicable discount
  const appliedDiscount = advanceBookingMultiplier < 1 ? Math.round((1 - advanceBookingMultiplier) * baseFare) : 0;

  return {
    baseFare,
    farePerPerson,
    totalFare,
    fareBreakdown: {
      baseFare: Math.round(baseFare * classMultipliers[cabinClass]),
      gst,
      airportCharges,
      fuelSurcharge,
      userDevelopmentFee,
      passengerServiceFee,
      totalTaxesAndFees: gst + airportCharges + fuelSurcharge + userDevelopmentFee + passengerServiceFee
    },
    appliedMultipliers: {
      cabinClass: classMultipliers[cabinClass],
      advanceBooking: advanceBookingMultiplier,
      weekend: weekendMultiplier,
      season: seasonMultiplier,
      timeOfDay: timeMultipliers[timeOfDay]
    },
    discount: appliedDiscount
  };
}

// Airlines with their full names and codeshare partners
const airlines = {
  "AI": "Air India",
  "UK": "Vistara",
  "IN": "IndiGo",
  "SG": "SpiceJet",
  "GF": "Go First",
  "IX": "Air India Express",
  "G8": "Go Air", 
  "QP": "Akasa Air",
  "6E": "IndiGo"
};

// Codeshare agreements between airlines
const codesharePartners = {
  AI: ["UK", "IX"],  // Air India partners with Vistara and Air India Express
  UK: ["AI", "SG"],  // Vistara partners with Air India and SpiceJet
  IN: ["6E", "GF"],  // IndiGo partners with its subsidiary and Go First
  SG: ["UK", "G8"],  // SpiceJet partners with Vistara and Go Air
  GF: ["IN", "QP"]   // Go First partners with IndiGo and Akasa Air
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
      // Define flight timings with time-based pricing
    const flightTimings = [
      { start: "05:30", timeOfDay: "morning", airline: 0 },
      { start: "08:30", timeOfDay: "peak", airline: 1 },
      { start: "11:30", timeOfDay: "standard", airline: 2 },
      { start: "14:30", timeOfDay: "standard", airline: 0 },
      { start: "17:30", timeOfDay: "peak", airline: 1 },
      { start: "20:30", timeOfDay: "night", airline: 2 }
    ];    // Generate flights for each timing including codeshare options
    flightTimings.forEach(timing => {
      // Get fare calculation for this time slot
      const timeSpecificFares = calculateFlightFare({
        ...fareParams,
        timeOfDay: timing.timeOfDay
      });

      // Calculate arrival time (based on duration)
      const duration = calculateFlightDuration(from, to);
      const durationHours = parseInt(duration.split('h')[0]);
      const durationMinutes = parseInt(duration.split('h')[1].split('m')[0]);
      
      const startTime = timing.start.split(':');
      const arrivalHour = (parseInt(startTime[0]) + durationHours) % 24;
      const arrivalMinute = (parseInt(startTime[1]) + durationMinutes) % 60;
      const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`;

      // Add main airline flight
      const mainAirlineCode = airlineKeys[timing.airline];
      flights.push({
        airlineName: airlines[mainAirlineCode],
        flightNumber: `${mainAirlineCode}${Math.floor(Math.random() * 1000)}`,
        departureTime: timing.start,
        arrivalTime: arrivalTime,
        departureAirportCode: from,
        arrivalAirportCode: to,
        fareType: cabinClass.replace("_", " ").toUpperCase(),
        price: timeSpecificFares.totalFare,
        fareBreakdown: timeSpecificFares.fareBreakdown,
        appliedMultipliers: timeSpecificFares.appliedMultipliers,
        discount: timeSpecificFares.discount,
        timeOfDay: timing.timeOfDay,
        operatedBy: mainAirlineCode
      });      // Add codeshare flights if available
      if (codesharePartners[mainAirlineCode]) {
        codesharePartners[mainAirlineCode].forEach(partnerCode => {
          // Codeshare flights have slightly different pricing
          const codeshareFares = calculateFlightFare({
            ...fareParams,
            timeOfDay: timing.timeOfDay,
          });

          flights.push({
            airlineName: airlines[partnerCode],
            flightNumber: `${partnerCode}${Math.floor(Math.random() * 1000)}`,
            departureTime: timing.start,
            arrivalTime: arrivalTime,
            departureAirportCode: from,
            arrivalAirportCode: to,
            fareType: cabinClass.replace("_", " ").toUpperCase(),
            price: Math.round(codeshareFares.totalFare * 0.95), // 5% discount on codeshare
            fareBreakdown: codeshareFares.fareBreakdown,
            appliedMultipliers: codeshareFares.appliedMultipliers,
            discount: codeshareFares.discount + Math.round(codeshareFares.totalFare * 0.05),
            timeOfDay: timing.timeOfDay,
            operatedBy: mainAirlineCode, // Show which airline actually operates the flight
            isCodeshare: true
          });
        });
      }
    });

    // If round trip, generate return flights
    if (returnDate) {
      let returnFlights = [];
      // Generate return flights with the same time slots but on return date
      returnFlights = flightTimings.map(timing => {
        // Calculate return fares with time-based pricing
        const returnFareParams = {
          ...fareParams,
          fromAirport: to,
          toAirport: from,
          timeOfDay: timing.timeOfDay
        };
        const returnFares = calculateFlightFare(returnFareParams);

        // Calculate arrival time for return flight
        const duration = calculateFlightDuration(to, from);
        const durationHours = parseInt(duration.split('h')[0]);
        const durationMinutes = parseInt(duration.split('h')[1].split('m')[0]);
        
        const startTime = timing.start.split(':');
        const arrivalHour = (parseInt(startTime[0]) + durationHours) % 24;
        const arrivalMinute = (parseInt(startTime[1]) + durationMinutes) % 60;
        const arrivalTime = `${String(arrivalHour).padStart(2, '0')}:${String(arrivalMinute).padStart(2, '0')}`;

        return {
          airlineName: airlines[airlineKeys[timing.airline]],
          flightNumber: `${airlineKeys[timing.airline]}${Math.floor(Math.random() * 1000)}`,
          departureTime: timing.start,
          arrivalTime: arrivalTime,
          departureAirportCode: to,
          arrivalAirportCode: from,
          fareType: cabinClass.replace("_", " ").toUpperCase(),
          price: returnFares.totalFare,
          fareBreakdown: returnFares.fareBreakdown,
          appliedMultipliers: returnFares.appliedMultipliers,
          discount: returnFares.discount,
          timeOfDay: timing.timeOfDay
        };
      });

      // Create optimized flight pairs for round trips
      const roundTripOptions = [];
      // Only pair flights with reasonable connection times (at least 2 hours between flights)
      flights.forEach(outbound => {
        returnFlights.forEach(inbound => {
          const outArrTime = parseInt(outbound.arrivalTime.replace(':', ''));
          const returnDepTime = parseInt(inbound.departureTime.replace(':', ''));
          // Ensure return flight is at least 2 hours after arrival
          if (returnDepTime > outArrTime + 200) {
            roundTripOptions.push({
              outbound,
              inbound,
              totalPrice: outbound.price + inbound.price,
              totalDiscount: outbound.discount + inbound.discount
            });
          }
        });
      });

      return roundTripOptions;
    }

    return flights;
  // Removed extra closing brace here
  } catch (error) {
    console.error('Error calculating fares:', error);
    return [];
  }
}

// Add styles for flight cards
document.addEventListener("DOMContentLoaded", function() {
    const styles = `
        .flight-card {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
            border: 1px solid #e0e0e0;
        }
        
        .flight-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .flight-airline-name {
            font-size: 1.2em;
            color: #333;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .flight-card hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 15px 0;
        }
        
        .flight-card button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            transition: background-color 0.2s;
        }
        
        .flight-card button:hover {
            background-color: #0056b3;
        }
        
        .booking-search-summary {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 15px 20px;
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
        }
        
        .flight-fare-details {
            background: #f8f9fa;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
        }
        
        .flight-time {
            font-size: 1.1em;
            color: #333;
            margin: 8px 0;
        }
        
        .flight-duration {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 8px;
        }
        
        .fare-amount {
            font-size: 1.2em;
            color: #28a745;
            font-weight: bold;
        }
        
        #flight-results {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
});
