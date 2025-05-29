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

    // Get the day of week from the selected date (0=Sunday, 1=Monday, ...)
    const departureDay = new Date(departure).getDay();
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const departureDayName = dayNames[departureDay];

    // Validate input
    if (!from || !to || !departure || !trainClass) {
      alert("Please fill in all required fields.");
      return;
    }

    // Simulated train data (replace with API call if available)
    const allTrains = [
      {
        name: "Rajdhani Express",
        number: "12951",
        from: "delhi",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
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
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
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
        days: ["mon", "wed", "fri", "sun"],
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
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
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
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
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
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
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
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
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
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "chair"],
        departure: "06:05",
        arrival: "10:40",
        fare: { ac1: 1800, ac2: 1100, ac3: 0, sleeper: 0, chair: 700 },
      },
      {
        name: "Bangalore Rajdhani",
        number: "22691",
        from: "bangalore",
        to: "delhi",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3"],
        departure: "20:00",
        arrival: "06:30",
        fare: { ac1: 4800, ac2: 2850, ac3: 2100, sleeper: 0, chair: 0 },
      },
      {
        name: "Bangalore Mumbai Udyan",
        number: "11302",
        from: "bangalore",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "20:30",
        arrival: "18:20",
        fare: { ac1: 2200, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Bangalore Kolkata Express",
        number: "12258",
        from: "bangalore",
        to: "kolkata",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "18:30",
        arrival: "20:45",
        fare: { ac1: 4100, ac2: 2500, ac3: 1700, sleeper: 750, chair: 0 },
      },
      {
        name: "Bangalore Chennai Shatabdi",
        number: "12008",
        from: "bangalore",
        to: "chennai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "chair"],
        departure: "16:00",
        arrival: "20:30",
        fare: { ac1: 1500, ac2: 1000, ac3: 0, sleeper: 0, chair: 750 },
      },
      {
        name: "Bangalore Hyderabad Express",
        number: "17603",
        from: "bangalore",
        to: "hyderabad",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "20:30",
        arrival: "08:30",
        fare: { ac1: 1800, ac2: 1200, ac3: 800, sleeper: 350, chair: 0 },
      },
      {
        name: "Bangalore Varanasi Express",
        number: "16588",
        from: "bangalore",
        to: "varanasi",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "10:20",
        arrival: "14:45",
        fare: { ac1: 3800, ac2: 2300, ac3: 1600, sleeper: 700, chair: 0 },
      },
      {
        name: "Bangalore Lucknow Express",
        number: "16586",
        from: "bangalore",
        to: "lucknow",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "07:30",
        arrival: "10:45",
        fare: { ac1: 3500, ac2: 2100, ac3: 1400, sleeper: 600, chair: 0 },
      },
      {
        name: "Bangalore Jaipur Express",
        number: "16532",
        from: "bangalore",
        to: "jaipur",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "11:15",
        arrival: "13:45",
        fare: { ac1: 4000, ac2: 2400, ac3: 1700, sleeper: 750, chair: 0 },
      },
      {
        name: "Bangalore Ahmedabad Express",
        number: "16506",
        from: "bangalore",
        to: "ahmedabad",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "09:45",
        arrival: "14:30",
        fare: { ac1: 3700, ac2: 2200, ac3: 1500, sleeper: 650, chair: 0 },
      },
      {
        name: "Bangalore Khajuraho Express",
        number: "16508",
        from: "bangalore",
        to: "khajuraho",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:30",
        arrival: "18:45",
        fare: { ac1: 3900, ac2: 2300, ac3: 1600, sleeper: 700, chair: 0 },
      },
      {
        name: "Mumbai Rajdhani",
        number: "12952",
        from: "mumbai",
        to: "delhi",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3"],
        departure: "17:00",
        arrival: "08:35",
        fare: { ac1: 4850, ac2: 2850, ac3: 2100, sleeper: 0, chair: 0 },
      },
      {
        name: "Mumbai Howrah Mail",
        number: "12809",
        from: "mumbai",
        to: "kolkata",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "21:00",
        arrival: "07:00",
        fare: { ac1: 2600, ac2: 1850, ac3: 1250, sleeper: 650, chair: 0 },
      },
      {
        name: "Mumbai Chennai Express",
        number: "11041",
        from: "mumbai",
        to: "chennai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:00",
        arrival: "07:30",
        fare: { ac1: 2300, ac2: 1600, ac3: 1050, sleeper: 500, chair: 0 },
      },
      {
        name: "Mumbai Bangalore Udyan",
        number: "11301",
        from: "mumbai",
                to: "bangalore",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "08:10",
        arrival: "06:00",
        fare: { ac1: 2200, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Mumbai Hyderabad Express",
        number: "17031",
        from: "mumbai",
        to: "hyderabad",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:10",
        arrival: "05:45",
        fare: { ac1: 2100, ac2: 1400, ac3: 900, sleeper: 350, chair: 0 },
      },
      {
        name: "Mumbai Varanasi Mahanagari",
        number: "22177",
        from: "mumbai",
        to: "varanasi",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "12:10",
        arrival: "15:10",
        fare: { ac1: 2500, ac2: 1700, ac3: 1100, sleeper: 550, chair: 0 },
      },
      {
        name: "Mumbai Lucknow Pushpak",
        number: "12534",
        from: "mumbai",
        to: "lucknow",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "08:20",
        arrival: "08:40",
        fare: { ac1: 2100, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Mumbai Jaipur Superfast",
        number: "12955",
        from: "mumbai",
        to: "jaipur",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "18:00",
        arrival: "08:30",
        fare: { ac1: 2200, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Mumbai Ahmedabad Shatabdi",
        number: "12009",
        from: "mumbai",
        to: "ahmedabad",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper", "chair"],
        departure: "14:30",
        arrival: "21:40",
        fare: { ac1: 1800, ac2: 1200, ac3: 800, sleeper: 350, chair: 400 },
      },
      // Example for Kolkata
      {
        name: "Kolkata Rajdhani",
        number: "12301",
        from: "kolkata",
        to: "delhi",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3"],
        departure: "16:50",
        arrival: "10:00",
        fare: { ac1: 4300, ac2: 2500, ac3: 1800, sleeper: 0, chair: 0 },
      },
      {
        name: "Howrah Mail",
        number: "12809",
        from: "kolkata",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "21:00",
        arrival: "07:00",
        fare: { ac1: 2600, ac2: 1850, ac3: 1250, sleeper: 650, chair: 0 },
      },
      {
        name: "Chennai Express",
        number: "11041",
        from: "kolkata",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:00",
        arrival: "07:30",
        fare: { ac1: 2300, ac2: 1600, ac3: 1050, sleeper: 500, chair: 0 },
      },
      {
        name: "Bangalore Udyan",
        number: "11301",
        from: "kolkata",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "08:10",
        arrival: "06:00",
        fare: { ac1: 2200, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Hyderabad Express",
        number: "17031",
        from: "kolkata",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:10",
        arrival: "05:45",
        fare: { ac1: 2100, ac2: 1400, ac3: 900, sleeper: 350, chair: 0 },
      },
      {
        name: "Varanasi Mahanagari",
        number: "22177",
        from: "kolkata",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "12:10",
        arrival: "15:10",
        fare: { ac1: 2500, ac2: 1700, ac3: 1100, sleeper: 550, chair: 0 },
      },
      {
        name: "Lucknow Pushpak",
        number: "12534",
        from: "kolkata",
        to: "lucknow",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "08:20",
        arrival: "08:40",
        fare: { ac1: 2100, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Jaipur Superfast",
        number: "12955",
        from: "kolkata",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "18:00",
        arrival: "08:30",
        fare: { ac1: 2200, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Ahmedabad Shatabdi",
        number: "12009",
        from: "kolkata",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper", "chair"],
        departure: "14:30",
        arrival: "21:40",
        fare: { ac1: 1800, ac2: 1200, ac3: 800, sleeper: 350, chair: 400 },
      },
      // Khajuraho to all major cities
      {
        name: "Khajuraho Delhi Express",
        number: "22448",
        from: "khajuraho",
        to: "delhi",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "11:05",
        arrival: "20:30",
        fare: { ac1: 2100, ac2: 1500, ac3: 950, sleeper: 400, chair: 0 },
      },
      {
        name: "Khajuraho Mumbai Express",
        number: "22165",
        from: "khajuraho",
        to: "mumbai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:30",
        arrival: "18:45",
        fare: { ac1: 3200, ac2: 1900, ac3: 1300, sleeper: 550, chair: 0 },
      },
      {
        name: "Khajuraho Kolkata Express",
        number: "12871",
        from: "khajuraho",
        to: "kolkata",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "08:30",
        arrival: "12:45",
        fare: { ac1: 2800, ac2: 1700, ac3: 1100, sleeper: 450, chair: 0 },
      },
      {
        name: "Khajuraho Chennai Express",
        number: "22647",
        from: "khajuraho",
        to: "chennai",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "12:30",
        arrival: "16:45",
        fare: { ac1: 3600, ac2: 2200, ac3: 1500, sleeper: 650, chair: 0 },
      },
      {
        name: "Khajuraho Bangalore Express",
        number: "16507",
        from: "khajuraho",
        to: "bangalore",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "18:30",
        arrival: "22:45",
        fare: { ac1: 3900, ac2: 2300, ac3: 1600, sleeper: 700, chair: 0 },
      },
      {
        name: "Khajuraho Hyderabad Express",
        number: "17067",
        from: "khajuraho",
        to: "hyderabad",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "16:30",
        arrival: "20:45",
        fare: { ac1: 3400, ac2: 2000, ac3: 1400, sleeper: 600, chair: 0 },
      },
      {
        name: "Khajuraho Varanasi Express",
        number: "11447",
        from: "khajuraho",
        to: "varanasi",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "14:30",
        arrival: "21:45",
        fare: { ac1: 1800, ac2: 1200, ac3: 800, sleeper: 350, chair: 0 },
      },
      {
        name: "Khajuraho Lucknow Express",
        number: "22446",
        from: "khajuraho",
        to: "lucknow",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "16:30",
        arrival: "01:45",
        fare: { ac1: 1600, ac2: 1000, ac3: 700, sleeper: 300, chair: 0 },
      },
      {
        name: "Khajuraho Jaipur Express",
        number: "19164",
        from: "khajuraho",
        to: "jaipur",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "19:30",
        arrival: "05:45",
        fare: { ac1: 2400, ac2: 1500, ac3: 1000, sleeper: 400, chair: 0 },
      },
      {
        name: "Khajuraho Ahmedabad Express",
        number: "19168",
        from: "khajuraho",
        to: "ahmedabad",
        days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
        classes: ["ac1", "ac2", "ac3", "sleeper"],
        departure: "11:30",
        arrival: "15:45",
        fare: { ac1: 2800, ac2: 1700, ac3: 1100, sleeper: 450, chair: 0 },
      },
    ];
    // Filter trains by from, to, class, and day of week
    const filteredTrains = allTrains.filter(
      (train) =>
        train.from === from &&
        train.to === to &&
        train.classes.includes(trainClass) &&
        (
          // If train.days is array of dates, allow all; if array of day names, match day
          train.days.includes(departure) ||
          train.days.includes(departureDayName) ||
          train.days.length === 7 // If all days, allow
        )
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
