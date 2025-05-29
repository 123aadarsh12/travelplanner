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
// Set minimum and maximum dates for departure and return inputs
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 60); // Add 60 days to today's date

  const formattedToday = today.toISOString().split("T")[0]; // Format today's date as YYYY-MM-DD
  const formattedMaxDate = maxDate.toISOString().split("T")[0]; // Format max date as YYYY-MM-DD

  // Set min and max attributes for departure and return inputs
  document.getElementById("departure").setAttribute("min", formattedToday);
  document.getElementById("departure").setAttribute("max", formattedMaxDate);

  // Update return date's minimum based on departure date
  document.getElementById("departure").addEventListener("change", (event) => {
    const departureDate = event.target.value;
    document.getElementById("return").setAttribute("min", departureDate);
  });
});

// ...existing code...

// Handle form submission for train booking
document
  .getElementById("train-booking-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get form values
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();
    const departure = document.getElementById("departure").value;
    const trainClass = document.getElementById("class").value;

    // Validate input
    if (!from || !to || !departure || !trainClass) {
      alert("Please fill in all required fields.");
      return;
    }

    // Simulated train data (replace with API call if available)
    // ...existing code...
    const allTrains = [
      {
        name: "Rajdhani Express",
        number: "12951",
        from: "delhi",
        to: "mumbai",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3"],
        departure: "16:25",
        arrival: "08:15",
        fare: { ac1: 4850, ac2: 2850, ac3: 2100, sleeper: 0, chair: 0 },
      },
      {
        name: "Shatabdi Express",
        number: "12004",
        from: "delhi",
        to: "lucknow",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "chair"],
        departure: "06:10",
        arrival: "12:55",
        fare: { ac1: 2450, ac2: 1350, ac3: 0, sleeper: 0, chair: 900 },
      },
      {
        name: "Delhi Chennai Superfast",
        number: "12622",
        from: "delhi",
        to: "chennai",
        days: ["2025-05-14", "2025-05-16", "2025-05-18", "2025-05-20"], // Mon, Wed, Fri, Sun
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "18:40",
        arrival: "20:10",
        fare: { ac1: 4200, ac2: 2600, ac3: 1800, sleeper: 750, chair: 0 },
      },
      {
        name: "Kolkata Rajdhani",
        number: "12302",
        from: "delhi",
        to: "kolkata",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3"],
        departure: "16:50",
        arrival: "10:00",
        fare: { ac1: 4300, ac2: 2500, ac3: 1800, sleeper: 0, chair: 0 },
      },
      {
        name: "Hyderabad Rajdhani",
        number: "12438",
        from: "delhi",
        to: "hyderabad",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3"],
        departure: "15:55",
        arrival: "13:55",
        fare: { ac1: 4100, ac2: 2400, ac3: 1700, sleeper: 0, chair: 0 },
      },
      {
        name: "Kashi Vishwanath Express",
        number: "15128",
        from: "delhi",
        to: "varanasi",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "06:35",
        arrival: "05:00",
        fare: { ac1: 2200, ac2: 1350, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Ashram Express",
        number: "12916",
        from: "delhi",
        to: "ahmedabad",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "15:20",
        arrival: "08:10",
        fare: { ac1: 3200, ac2: 1900, ac3: 1300, sleeper: 500, chair: 0 },
      },
      {
        name: "Ajmer Shatabdi",
        number: "12015",
        from: "delhi",
        to: "jaipur",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "chair"],
        departure: "06:05",
        arrival: "10:40",
        fare: { ac1: 1800, ac2: 1100, ac3: 0, sleeper: 0, chair: 700 },
      },
      {
        name: "Bangalore Rajdhani",
        number: "22692",
        from: "delhi",
        to: "bangalore",
        days: ["2025-05-14", "2025-05-16", "2025-05-18", "2025-05-20"], // Mon, Wed, Fri, Sun
        classes: ["ac1", "ac2", "ac3"],
        departure: "20:50",
        arrival: "05:20",
        fare: { ac1: 4800, ac2: 2850, ac3: 2100, sleeper: 0, chair: 0 },
      },
      {
        name: "Gomti Express",
        number: "12420",
        from: "delhi",
        to: "lucknow",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "12:20",
        arrival: "21:25",
        fare: { ac1: 2100, ac2: 1250, ac3: 900, sleeper: 350, chair: 0 },
      },
      {
        name: "Swarna Jayanti Rajdhani",
        number: "12957",
        from: "delhi",
        to: "ahmedabad",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3"],
        departure: "19:55",
        arrival: "08:35",
        fare: { ac1: 3500, ac2: 2000, ac3: 1400, sleeper: 0, chair: 0 },
      },
      {
        name: "Delhi Secunderabad Duronto",
        number: "12286",
        from: "delhi",
        to: "hyderabad",
        days: ["2025-05-14", "2025-05-16", "2025-05-18", "2025-05-20"], // Mon, Wed, Fri, Sun
        classes: ["ac1", "ac2", "ac3"],
        departure: "12:50",
        arrival: "10:00",
        fare: { ac1: 4100, ac2: 2400, ac3: 1700, sleeper: 0, chair: 0 },
      },
      {
        name: "Delhi Varanasi Vande Bharat",
        number: "22436",
        from: "delhi",
        to: "varanasi",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "chair"],
        departure: "06:00",
        arrival: "14:00",
        fare: { ac1: 3200, ac2: 0, ac3: 0, sleeper: 0, chair: 1700 },
      },
      {
        name: "Rajdhani Express",
        number: "12301",
        from: "delhi",
        to: "mumbai",
        days: ["2025-05-14", "2025-05-15", "2025-05-16"],
        classes: ["ac1", "ac2", "ac3"],
        departure: "16:00",
        arrival: "08:00",
        fare: { ac1: 2500, ac2: 1800, ac3: 1200, sleeper: 600, chair: 800 },
      },
      {
        name: "Duronto Express",
        number: "12290",
        from: "mumbai",
        to: "delhi",
        days: ["2025-05-14", "2025-05-16"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "20:00",
        arrival: "12:00",
        fare: { ac1: 2400, ac2: 1700, ac3: 1100, sleeper: 550, chair: 700 },
      },
      {
        name: "Shatabdi Express",
        number: "12001",
        from: "delhi",
        to: "lucknow",
        days: ["2025-05-14", "2025-05-15", "2025-05-16"],
        classes: ["ac1", "ac2", "chair"],
        departure: "06:00",
        arrival: "12:30",
        fare: { ac1: 2000, ac2: 1400, ac3: 0, sleeper: 0, chair: 900 },
      },
      {
        name: "Garib Rath",
        number: "12909",
        from: "mumbai",
        to: "jaipur",
        days: ["2025-05-14", "2025-05-15"],
        classes: ["ac3", "sleeper"],
        departure: "17:30",
        arrival: "09:45",
        fare: { ac1: 0, ac2: 0, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Delhi Chennai Superfast",
        number: "12622",
        from: "delhi",
        to: "chennai",
        days: ["2025-05-14", "2025-05-15", "2025-05-16"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "18:40",
        arrival: "20:10",
        fare: { ac1: 2600, ac2: 1850, ac3: 1200, sleeper: 600, chair: 0 },
      },
      {
        name: "Delhi Kolkata Mail",
        number: "12324",
        from: "delhi",
        to: "kolkata",
        days: ["2025-05-14", "2025-05-15", "2025-05-16"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "19:15",
        arrival: "17:30",
        fare: { ac1: 2500, ac2: 1700, ac3: 1100, sleeper: 550, chair: 0 },
      },
      {
        name: "Delhi Hyderabad Express",
        number: "12724",
        from: "delhi",
        to: "hyderabad",
        days: ["2025-05-14", "2025-05-15", "2025-05-16"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "16:30",
        arrival: "18:45",
        fare: { ac1: 2400, ac2: 1600, ac3: 1000, sleeper: 500, chair: 0 },
      },
      {
        name: "Delhi Jaipur Intercity",
        number: "12985",
        from: "delhi",
        to: "jaipur",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper", "chair"],
        departure: "17:35",
        arrival: "22:25",
        fare: { ac1: 1200, ac2: 900, ac3: 600, sleeper: 250, chair: 300 },
      },
      {
        name: "Delhi Goa Express",
        number: "12780",
        from: "delhi",
        to: "goa",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "15:00",
        arrival: "20:30",
        fare: { ac1: 3500, ac2: 2200, ac3: 1500, sleeper: 600, chair: 0 },
      },
      {
        name: "Delhi Kerala Express",
        number: "12626",
        from: "delhi",
        to: "kerala",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "11:25",
        arrival: "19:10",
        fare: { ac1: 4200, ac2: 2600, ac3: 1800, sleeper: 750, chair: 0 },
      },
      {
        name: "Delhi Udaipur Express",
        number: "12963",
        from: "delhi",
        to: "udaipur",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "19:00",
        arrival: "07:20",
        fare: { ac1: 2100, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Delhi Rishikesh Express",
        number: "14041",
        from: "delhi",
        to: "rishikesh",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "15:20",
        arrival: "21:10",
        fare: { ac1: 1200, ac2: 900, ac3: 600, sleeper: 250, chair: 0 },
      },
      {
        name: "Delhi Varanasi Express",
        number: "14258",
        from: "delhi",
        to: "varanasi",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper", "chair"],
        departure: "20:50",
        arrival: "10:30",
        fare: { ac1: 1700, ac2: 1200, ac3: 800, sleeper: 350, chair: 400 },
      },
      {
        name: "Delhi Mysore Swarna Jayanti",
        number: "12782",
        from: "delhi",
        to: "mysore",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "13:45",
        arrival: "19:30",
        fare: { ac1: 4100, ac2: 2500, ac3: 1700, sleeper: 700, chair: 0 },
      },
      {
        name: "Delhi Shimla Express",
        number: "52455",
        from: "delhi",
        to: "shimla",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper", "chair"],
        departure: "06:40",
        arrival: "17:30",
        fare: { ac1: 1800, ac2: 1200, ac3: 800, sleeper: 350, chair: 400 },
      },
      {
        name: "Delhi Kutch Express",
        number: "12959",
        from: "delhi",
        to: "rann of kutch",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "17:45",
        arrival: "09:30",
        fare: { ac1: 3200, ac2: 2000, ac3: 1400, sleeper: 600, chair: 0 },
      },
      {
        name: "Delhi Khajuraho Express",
        number: "22447",
        from: "delhi",
        to: "khajuraho",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "11:05",
        arrival: "20:30",
        fare: { ac1: 2100, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Delhi Jaisalmer Express",
        number: "14659",
        from: "delhi",
        to: "jaisalmer",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "17:35",
        arrival: "11:50",
        fare: { ac1: 2500, ac2: 1700, ac3: 1100, sleeper: 500, chair: 0 },
      },
      {
        name: "Delhi Pondicherry Express",
        number: "22404",
        from: "delhi",
        to: "pondicherry",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "21:15",
        arrival: "08:30",
        fare: { ac1: 4200, ac2: 2600, ac3: 1800, sleeper: 750, chair: 0 },
      },
      {
        name: "Delhi Coorg Express",
        number: "16512",
        from: "delhi",
        to: "coorg",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:30",
        arrival: "20:00",
        fare: { ac1: 4100, ac2: 2500, ac3: 1700, sleeper: 700, chair: 0 },
      },
      {
        name: "Delhi Darjeeling Mail",
        number: "12343",
        from: "delhi",
        to: "darjeeling",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "19:35",
        arrival: "13:10",
        fare: { ac1: 3200, ac2: 2000, ac3: 1400, sleeper: 600, chair: 0 },
      },
      {
        name: "Delhi Amritsar Shatabdi",
        number: "12013",
        from: "delhi",
        to: "amritsar",
        days: [
          "2025-05-14",
          "2025-05-15",
          "2025-05-16",
          "2025-05-17",
          "2025-05-18",
          "2025-05-19",
          "2025-05-20",
        ],
        classes: ["ac1", "ac2", "ac3", "sleeper", "chair"],
        departure: "07:20",
        arrival: "13:45",
        fare: { ac1: 1500, ac2: 1100, ac3: 800, sleeper: 350, chair: 400 },
      },
    ];
    // Filter trains by from, to, date, and class
    const filteredTrains = allTrains.filter(
      (train) =>
        train.from === from &&
        train.to === to &&
        train.days.includes(departure) &&
        train.classes.includes(trainClass)
    );

    // Display results
    const trainList = document.getElementById("train-list");
    trainList.innerHTML = ""; // Clear previous results

    if (filteredTrains.length === 0) {
      trainList.innerHTML = `<li>No trains found for the selected route, date, and class.</li>`;
    } else {
      filteredTrains.forEach((train) => {
        trainList.innerHTML += `
          <li>
            <strong>${train.name} (${train.number})</strong><br>
            Departure: ${train.departure} | Arrival: ${train.arrival}<br>
            Class: ${trainClass.toUpperCase()} | Fare: ₹${
          train.fare[trainClass]
        }
          </li>
        `;
      });
    }

    // Show results section
    document.getElementById("train-results").style.display = "block";
  });

// ...rest of existing code...

// Function to check PNR status
async function checkPNRStatus() {
  const pnrInput = document.getElementById("pnr").value.trim();
  const pnrResult = document.getElementById("pnr-result");
  const pnrStatusMessage = document.getElementById("pnr-status-message");

  // Validate PNR input
  if (!/^\d{10}$/.test(pnrInput)) {
    pnrStatusMessage.innerHTML = `<div class="alert alert-warning">Please enter a valid 10-digit PNR number.</div>`;
    pnrResult.style.display = "block";
    return;
  }

  // Show loading spinner
  pnrResult.style.display = "block";
  pnrStatusMessage.innerHTML = `
    <div class="spinner"></div>
    <span>Fetching PNR status... Please wait.</span>
  `;

  const url = `https://irctc-indian-railway-pnr-status.p.rapidapi.com/getPNRStatus/${pnrInput}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "4c9328c1fbmsh3d67d4b76c41350p1ae51fjsn665cb6fcec0f",
      "x-rapidapi-host": "irctc-indian-railway-pnr-status.p.rapidapi.com",
    },
  };

  // ...existing code...

  try {
    const response = await fetch(url, options);
    if (response.status === 429) {
      pnrStatusMessage.innerHTML = `<div class="alert alert-danger">You have reached the maximum number of allowed requests. Please try again later.</div>`;
      return;
    }
    if (!response.ok) {
      throw new Error("Failed to fetch PNR status. Please try again later.");
    }
    const data = await response.json();
    console.log("Full API Response:", data);

    // Fix: Remove 'data.success' check, only check for data.data
    if (data && data.data) {
      const pnrData = data.data;
      const pnr = pnrData.pnrNumber || "N/A";
      const trainName = pnrData.trainName || "N/A";
      const trainNumber = pnrData.trainNumber || "N/A";
      const journeyDate = pnrData.dateOfJourney
        ? new Date(pnrData.dateOfJourney).toLocaleDateString("en-GB")
        : "N/A";
      const boardingStation = pnrData.boardingPoint || "N/A";
      const reservationUpto = pnrData.reservationUpto || "N/A";
      const fromStation = pnrData.sourceStation || "N/A";
      const toStation = pnrData.destinationStation || "N/A";
      const journeyClass = pnrData.journeyClass || "N/A";
      const chartStatus = pnrData.chartStatus || "N/A";
      const totalFare = pnrData.bookingFare || pnrData.ticketFare || "N/A";
      const passengers = Array.isArray(pnrData.passengerList)
        ? pnrData.passengerList
            .map(
              (passenger, index) => `
              <tr>
                <td>Passenger ${index + 1}</td>
                <td>${passenger.bookingStatusDetails || "N/A"}</td>
                <td>${passenger.currentStatusDetails || "N/A"}</td>
                <td>${passenger.coachPosition || ""}</td>
              </tr>
            `
            )
            .join("")
        : `<tr><td colspan="4">No passenger details available.</td></tr>`;

      pnrStatusMessage.innerHTML = `
      <div class="pnr-irctc-table-wide">
        <div class="pnr-header">You Queried For : <b>PNR Number: ${pnr}</b></div>
        <table>
          <tr>
            <th>Train Number</th>
            <th>Train Name</th>
            <th>Boarding Date (DD-MM-YYYY)</th>
            <th>From</th>
            <th>To</th>
            <th>Reserved Upto</th>
            <th>Boarding Point</th>
            <th>Class</th>
          </tr>
          <tr>
            <td>${trainNumber}</td>
            <td>${trainName}</td>
            <td>${journeyDate}</td>
            <td>${fromStation}</td>
            <td>${toStation}</td>
            <td>${reservationUpto}</td>
            <td>${boardingStation}</td>
            <td>${journeyClass}</td>
          </tr>
        </table>
        <table>
          <tr>
            <th>S. No.</th>
            <th>Booking Status (Coach No , Berth No., Quota)</th>
            <th>*Current Status (Coach No , Berth No.)</th>
            <th>Coach Position</th>
          </tr>
          ${passengers}
        </table>
        <table>
          <tr>
            <th>Total Fare</th>
            <th>Charting Status</th>
            <th>Remarks if any</th>
            <th>Train Status</th>
          </tr>
          <tr>
            <td>${totalFare}</td>
            <td>${chartStatus}</td>
            <td></td>
            <td></td>
          </tr>
        </table>
        <div style="margin-top:10px;font-size:13px;color:#007bff;">
          *Please Note that in case the Final Charts have not been prepared, the Current Status might upgrade/downgrade at a later stage.
        </div>
      </div>
    `;
    } else {
      pnrStatusMessage.innerHTML = `<div class="alert alert-danger">No PNR data found. Please check your PNR number and try again.</div>`;
    }
  } catch (error) {
    pnrStatusMessage.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
  }
  // Add IRCTC-like full-width table styles
  const irctcStyle = document.createElement("style");
  irctcStyle.innerHTML = `
  .pnr-irctc-table-wide {
    background: #fff;
    border-radius: 8px;
    padding: 18px;
    box-shadow: 0 2px 8px #e0e0e0;
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
  }
  .pnr-irctc-table-wide .pnr-header {
    font-size: 1.2em;
    margin-bottom: 16px;
    text-align: center;
  }
  .pnr-irctc-table-wide table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10px;
  }
  .pnr-irctc-table-wide th, .pnr-irctc-table-wide td {
    border: 1px solid #bdbdbd;
    padding: 8px 10px;
    text-align: center;
  }
  .pnr-irctc-table-wide th {
    background: #2196f3;
    color: #fff;
    font-weight: 600;
  }
  .pnr-irctc-table-wide tr:nth-child(even) {
    background: #f7fafd;
  }
`;
  document.head.appendChild(irctcStyle);
}
