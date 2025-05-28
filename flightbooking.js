window.addEventListener("DOMContentLoaded", function () {
  // Get values from sessionStorage (with sensible defaults)
  const adults = parseInt(sessionStorage.getItem("bookingAdults") || "1", 10);
  const children = parseInt(
    sessionStorage.getItem("bookingChildren") || "0",
    10
  );
  const from = sessionStorage.getItem("bookingFrom") || "DEL";
  const to = sessionStorage.getItem("bookingTo") || "BOM";
  const journeyType =
    sessionStorage.getItem("bookingJourneyType") || "round-trip";
  const departure = sessionStorage.getItem("bookingDeparture") || "2025-06-28";
  const returnDate = sessionStorage.getItem("bookingReturn") || "";

  // Airport code to name
  const airportNames = {
    DEL: "New Delhi",
    BOM: "Mumbai",
    BLR: "Bangalore",
    MAA: "Chennai",
    CCU: "Kolkata",
  };

  // Format date as: Sat, Jun 28
  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  // Compose summary line
  const travelerCount = adults + children;
  const tripSummary = document.getElementById("trip-summary");
  tripSummary.innerHTML = `
    ${journeyType === "round-trip" ? "Round-trip" : "One-way"}
    &nbsp;•&nbsp; ${travelerCount} traveler${travelerCount > 1 ? "s" : ""}
    &nbsp;•&nbsp; ${formatDate(departure)}${
    journeyType === "round-trip" && returnDate
      ? " - " + formatDate(returnDate)
      : ""
  }
  `;

  // Compose route title
  const routeTitle = document.getElementById("route-title");
  routeTitle.textContent = `${airportNames[from] || from} to ${
    airportNames[to] || to
  }`;

  // Generate traveler cards
  // ...existing code above...
  let cardsHtml = "";
  let travelerIndex = 0;
  for (let i = 1; i <= adults; i++, travelerIndex++) {
    cardsHtml += `
    <div class="card" data-traveler-index="${travelerIndex}">
      <div class="card-title">👤 Adult ${i}</div>
      <button type="button" class="btn-edit-traveler" data-traveler-index="${travelerIndex}" style="background:#fff;border:1px solid #0071c2;color:#0071c2;padding:8px 18px;border-radius:5px;font-weight:500;cursor:pointer;margin-bottom:14px;">Add this traveler's details</button>
      <ul class="bag-list">
        <li>1 personal item<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">Fits under the seat in front of you</span></li>
        <li style="margin-top:10px;">1 carry-on bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">25 x 35 x 55 cm · 7 kg</span></li>
        <li style="margin-top:10px;">1 checked bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">15 kg</span></li>
      </ul>
    </div>
  `;
  }
  for (let i = 1; i <= children; i++, travelerIndex++) {
    cardsHtml += `
    <div class="card" data-traveler-index="${travelerIndex}">
      <div class="card-title">🧒 Child ${i}</div>
      <button type="button" class="btn-edit-traveler" data-traveler-index="${travelerIndex}" style="background:#fff;border:1px solid #0071c2;color:#0071c2;padding:8px 18px;border-radius:5px;font-weight:500;cursor:pointer;margin-bottom:14px;">Add this traveler's details</button>
      <ul class="bag-list">
        <li>1 personal item<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">Fits under the seat in front of you</span></li>
        <li style="margin-top:10px;">1 carry-on bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">25 x 35 x 55 cm · 7 kg</span></li>
        <li style="margin-top:10px;">1 checked bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">15 kg</span></li>
      </ul>
    </div>
  `;
  }
  // ...existing code below...
  document.querySelector(".traveler-cards").innerHTML = cardsHtml;

  // Update price details (example static price, you can make dynamic)
  const fare = parseFloat(sessionStorage.getItem("bookingFare") || "0");
  let priceRows = "";
  if (adults > 0)
    priceRows += `<div class="price-row"><span>Adult (${adults})</span></div>`;
  if (children > 0)
    priceRows += `<div class="price-row"><span>Child (${children})</span></div>`;
  document.getElementById("price-breakdown").innerHTML = priceRows;
  document.getElementById("total-price").textContent =
    "INR" + fare.toLocaleString(undefined, { minimumFractionDigits: 2 });
  document.getElementById("traveler-count").textContent = travelerCount;
  // Open modal on "Add this traveler's details" click
  let currentTravelerIndex = null;
  let currentTravelerType = null; // "adult" or "child"

  document.body.addEventListener("click", function (e) {
    // Open modal for editing
    if (e.target && e.target.classList.contains("btn-edit-traveler")) {
      currentTravelerIndex = e.target.getAttribute("data-traveler-index");
      // Detect traveler type from card title
      const card = document.querySelector(
        `.card[data-traveler-index="${currentTravelerIndex}"]`
      );
      if (
        card &&
        card.querySelector(".card-title") &&
        card.querySelector(".card-title").textContent.includes("Child")
      ) {
        currentTravelerType = "child";
      } else {
        currentTravelerType = "adult";
      }
      document.getElementById("traveler-modal").style.display = "flex";
      return;
    }
    // Close modal
    if (e.target && e.target.id === "close-modal") {
      document.getElementById("traveler-modal").style.display = "none";
      return;
    }
    // Handle Done button
    if (e.target && e.target.id === "done-btn") {
      const form = document.getElementById("traveler-form");
      const firstName = form
        .querySelector('input[placeholder="Enter first name(s)"]')
        .value.trim();
      const lastName = form
        .querySelector('input[placeholder="Enter last name(s)"]')
        .value.trim();
      const gender = form.querySelector("select").value;
      if (!firstName || !lastName || !gender) {
        alert("Please fill all required fields.");
        return;
      }
      // Update card
      const card = document.querySelector(
        `.card[data-traveler-index="${currentTravelerIndex}"]`
      );
      if (card) {
        const icon = currentTravelerType === "child" ? "🧒" : "👤";
        card.innerHTML = `
          <div class="card-title" style="display:flex;align-items:center;gap:8px;">
            <span>${icon}</span>
            <span style="font-weight:600;">${firstName} ${lastName}</span>
            <span style="color:#007a1c;font-size:1.3em;margin-left:auto;">&#10003;</span>
          </div>
          <div style="margin-bottom:8px;">
            ${gender.charAt(0).toUpperCase() + gender.slice(1)}
          </div>
          <button type="button" class="btn-edit-traveler" data-traveler-index="${currentTravelerIndex}" style="background:#fff;border:1px solid #0071c2;color:#0071c2;padding:8px 18px;border-radius:5px;font-weight:500;cursor:pointer;margin-bottom:14px;">Edit this traveler's details</button>
          <ul class="bag-list">
            <li>1 personal item<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">Fits under the seat in front of you</span></li>
            <li style="margin-top:10px;">1 carry-on bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">25 x 35 x 55 cm · 7 kg</span></li>
            <li style="margin-top:10px;">1 checked bag<br><span style="color:#007a1c;">Included</span><br><span style="font-size:0.95em;">15 kg</span></li>
          </ul>
        `;
        // Set class and attributes AFTER updating innerHTML
        card.classList.add("filled");
        card.setAttribute("data-name", firstName + " " + lastName);
        card.setAttribute(
          "data-type",
          currentTravelerType === "child" ? "Child" : "Adult"
        );
        card.setAttribute(
          "data-gender",
          gender.charAt(0).toUpperCase() + gender.slice(1)
        );
      }
      document.getElementById("traveler-modal").style.display = "none";
      form.reset();
      return;
    }
  });

  // Optional: close modal on ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape")
      document.getElementById("traveler-modal").style.display = "none";
  });

  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Check contact email and phone
    const email = document.getElementById("contact-email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    if (!email || !phone) {
      alert("Please fill in your contact email and phone number.");
      return;
    }
    // Check all traveler cards for .filled class
    let allFilled = true;
    document.querySelectorAll(".traveler-cards .card").forEach((card) => {
      if (!card.classList.contains("filled")) {
        allFilled = false;
      }
    });

    if (!allFilled) {
      alert("Please fill in all traveler details.");
      return;
    }

    // Save contact info
    sessionStorage.setItem("contactEmail", email);
    sessionStorage.setItem("contactPhone", phone);

    // Save traveler details from filled cards
    document.querySelectorAll(".traveler-cards .card").forEach((card, idx) => {
      const name = card.getAttribute("data-name") || "";
      const type = card.getAttribute("data-type") || "Adult";
      const gender = card.getAttribute("data-gender") || "";
      sessionStorage.setItem(`traveler${idx}_name`, name);
      sessionStorage.setItem(`traveler${idx}_type`, type);
      sessionStorage.setItem(`traveler${idx}_gender`, gender);
    });

    // Redirect to next page
    window.location.href = "flightselectseat.html";
  });
});
