function calculateFlightFareWithDetails(origin, destination, departDate, returnDate) {
  try {
    // Get the distance between cities
    const distance = cityDistances[origin]?.[destination] || 0;
    if (distance === 0) {
      throw new Error('Route not available');
    }

    // Calculate days in advance
    const today = new Date();
    const departureDay = new Date(departDate);
    const bookingDaysInAdvance = Math.ceil((departureDay - today) / (1000 * 60 * 60 * 24));

    // Check if departure is on weekend
    const isWeekend = departureDay.getDay() === 0 || departureDay.getDay() === 6;

    // Check if it's peak season (December-January, May-June)
    const month = departureDay.getMonth();
    const isPeakSeason = [0, 1, 4, 5, 11].includes(month);    // Calculate base rate per km based on distance with a more realistic curve
    // Shorter flights have higher per-km rates due to fixed costs
    let ratePerKm;
    if (distance <= 300) {
      ratePerKm = 15; // Very short routes (high fixed costs per km)
    } else if (distance <= 500) {
      ratePerKm = 12; // Short routes
    } else if (distance <= 1000) {
      ratePerKm = 9;  // Medium routes
    } else if (distance <= 2000) {
      ratePerKm = 7;  // Long routes
    } else {
      ratePerKm = 6;  // Very long routes (economies of scale)
    }

    // Calculate base fare with minimum fare threshold
    const minBaseFare = 2500; // Minimum base fare for any flight
    let baseFare = Math.round(distance * ratePerKm);
    baseFare = Math.max(baseFare, minBaseFare); // Ensure minimum fare
      // Apply dynamic multipliers based on various factors
    const weekendMultiplier = isWeekend ? 1.25 : 1.0; // 25% premium for weekend flights
    const seasonMultiplier = isPeakSeason ? 1.35 : 1.0; // 35% premium during peak seasons
    
    // Dynamic booking multiplier based on how far in advance the booking is made
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

    // Calculate time of day adjustment (assuming 6 AM to 9 PM flights)
    const hour = departureDay.getHours();
    const timeOfDayMultiplier = (hour >= 6 && hour <= 9) || (hour >= 17 && hour <= 20) 
      ? 1.2  // Peak hours (morning and evening) 20% premium
      : 1.0;

    // Calculate discounts and adjustments
    const discount = Math.round((1 - advanceBookingMultiplier) * baseFare);
    baseFare = Math.round(baseFare * weekendMultiplier * seasonMultiplier * 
                         advanceBookingMultiplier * timeOfDayMultiplier);

    // Add taxes and charges
    const gst = Math.round(baseFare * 0.18); // 18% GST
    const fuelSurcharge = Math.round(distance * 0.5); // Fuel surcharge based on distance
    const airportCharges = 850; // Base airport charges
    const userDevelopmentFee = 350; // UDF
    const passengerServiceFee = 300; // PSF
    
    const taxes = gst + fuelSurcharge + airportCharges + userDevelopmentFee + passengerServiceFee;
    const totalFare = baseFare + taxes + airportCharges;    return {
      fare: totalFare,
      baseFare: baseFare,
      fareBreakdown: {
        basePrice: baseFare,
        gst: gst,
        fuelSurcharge: fuelSurcharge,
        airportCharges: airportCharges,
        userDevelopmentFee: userDevelopmentFee,
        passengerServiceFee: passengerServiceFee,
      },
      appliedMultipliers: {
        weekend: weekendMultiplier,
        season: seasonMultiplier,
        advanceBooking: advanceBookingMultiplier,
        timeOfDay: timeOfDayMultiplier
      },
      discount: discount > 0 ? discount : 0,
      distance: distance,
      bookingDaysInAdvance: bookingDaysInAdvance,
      isPeakSeason: isPeakSeason,
      isWeekend: isWeekend,
      currency: 'INR',
      status: 'success'
    };
  } catch (error) {
    console.error('Error calculating flight fare:', error);
    return {
      fare: 0,
      baseFare: 0,
      taxes: 0,
      airportCharges: 0,
      discount: 0,
      distance: 0,
      currency: 'INR',
      status: 'error',
      message: error.message || 'Error calculating flight fare. Please try again.'
    };
  }
}

// No longer need the fetchFlightFare alias since we're using calculateFlightFareWithDetails directly

// First declare and initialize URL parameters
const urlParams = new URLSearchParams(window.location.search);
const to = urlParams.get("to");
const from = urlParams.get("from");
const departure = urlParams.get("departure");
const returnDate = urlParams.get("return");
const adults = parseInt(urlParams.get("adults"), 10) || 0;
const children = parseInt(urlParams.get("children"), 10) || 0;

// Rest of the validation and logic
if (!to || !from || !departure || !returnDate) {
  alert("Missing required trip details. Please go back and fill the form.");
  window.location.href = "index1.html";
}
// Calculate trip duration (number of days)
const startDate = new Date(departure);
const endDate = new Date(returnDate);
const tripDays = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 1); // Ensure at least 1 day

// Capitalize the first letter of a city
function capitalize(city) {
  return city ? city.charAt(0).toUpperCase() + city.slice(1) : "";
}
const cityDistances = {
  agra: {
    ahmedabad: 900,
    amritsar: 650,
    delhi: 200,
    mumbai: 1200,
    bangalore: 2100,
    kolkata: 1300,
    chennai: 2200,
    pune: 1300,
    hyderabad: 1400,
    jaipur: 240,
    lucknow: 330,
    chandigarh: 450,
    dehradun: 400,
    varanasi: 600,
    patna: 900,
    bhopal: 500,
    surat: 1100,
    ranchi: 1000,
    visakhapatnam: 1600,
    udaipur: 600,
    jodhpur: 550,
    ludhiana: 400,
    kanpur: 250,
    nagpur: 900,
    vadodara: 1000,
    rajkot: 1100,
    ooty: 2300,
    darjeeling: 1400,
    shimla: 300,
    cochin: 2600,
    bhubaneswar: 1500,
  },
  // Add these objects inside cityDistances
  ahmedabad: {
    agra: 900,
    delhi: 920,
    mumbai: 530,
    bangalore: 1490,
    kolkata: 1850,
    chennai: 1570,
    pune: 660,
    hyderabad: 1200,
    jaipur: 640,
    lucknow: 1150,
    chandigarh: 1200,
    dehradun: 1300,
    agra: 900,
    varanasi: 1300,
    patna: 1600,
    bhopal: 580,
    surat: 260,
    ranchi: 1500,
    visakhapatnam: 1600,
    udaipur: 250,
    jodhpur: 450,
    ludhiana: 1300,
    kanpur: 1100,
    nagpur: 850,
    vadodara: 100,
    rajkot: 220,
    ooty: 1800,
    darjeeling: 2100,
    shimla: 1350,
    cochin: 1900,
    bhubaneswar: 1700,
    amritsar: 1400,
  },

  amritsar: {
    delhi: 450,
    mumbai: 1850,
    bangalore: 2500,
    kolkata: 1900,
    chennai: 2650,
    pune: 1900,
    hyderabad: 2000,
    jaipur: 750,
    lucknow: 900,
    chandigarh: 240,
    dehradun: 580,
    agra: 650,
    varanasi: 1250,
    patna: 1500,
    bhopal: 1230,
    surat: 1630,
    ranchi: 1650,
    visakhapatnam: 2250,
    udaipur: 1120,
    jodhpur: 1050,
    ludhiana: 150,
    kanpur: 930,
    nagpur: 1530,
    vadodara: 1600,
    rajkot: 1700,
    ooty: 2850,
    darjeeling: 1950,
    shimla: 480,
    cochin: 3150,
    bhubaneswar: 2150,
    ahmedabad: 1400,
  },

  bhopal: {
    delhi: 750,
    mumbai: 780,
    bangalore: 1300,
    kolkata: 1400,
    chennai: 1400,
    pune: 780,
    hyderabad: 850,
    jaipur: 600,
    lucknow: 650,
    chandigarh: 1000,
    dehradun: 1100,
    agra: 500,
    varanasi: 800,
    patna: 1100,
    amritsar: 1230,
    surat: 700,
    ranchi: 1000,
    visakhapatnam: 1200,
    udaipur: 550,
    jodhpur: 750,
    ludhiana: 1150,
    kanpur: 550,
    nagpur: 350,
    vadodara: 650,
    rajkot: 850,
    ooty: 1600,
    darjeeling: 1700,
    shimla: 1150,
    cochin: 1800,
    bhubaneswar: 1100,
    ahmedabad: 580,
  },
  bangalore: {
    delhi: 2150,
    mumbai: 980,
    kolkata: 1870,
    chennai: 350,
    pune: 840,
    hyderabad: 570,
    jaipur: 2000,
    lucknow: 1900,
    chandigarh: 2400,
    dehradun: 2500,
    agra: 2100,
    varanasi: 1900,
    patna: 2100,
    bhopal: 1400,
    surat: 1200,
    ranchi: 1800,
    visakhapatnam: 1200,
    udaipur: 1600,
    jodhpur: 1700,
    ludhiana: 2400,
    kanpur: 1900,
    nagpur: 1100,
    vadodara: 1300,
    rajkot: 1500,
    ooty: 270,
    darjeeling: 2200,
    shimla: 2500,
    cochin: 500,
    bhubaneswar: 1400,
  },
  bhubaneswar: {
    delhi: 1700,
    mumbai: 1700,
    bangalore: 1400,
    kolkata: 400,
    chennai: 1200,
    pune: 1600,
    hyderabad: 1000,
    jaipur: 1800,
    lucknow: 1300,
    chandigarh: 2000,
    dehradun: 2100,
    agra: 1500,
    varanasi: 900,
    patna: 850,
    amritsar: 2150,
    surat: 1600,
    ranchi: 500,
    visakhapatnam: 450,
    udaipur: 1900,
    jodhpur: 2000,
    ludhiana: 2100,
    kanpur: 1200,
    nagpur: 1000,
    vadodara: 1700,
    rajkot: 1900,
    ooty: 1700,
    darjeeling: 800,
    shimla: 2100,
    cochin: 1800,
    ahmedabad: 1700,
  },

  chandigarh: {
    delhi: 250,
    mumbai: 1650,
    bangalore: 2400,
    kolkata: 1700,
    chennai: 2500,
    pune: 1700,
    hyderabad: 1900,
    jaipur: 500,
    lucknow: 700,
    bhubaneswar: 2000,
    dehradun: 200,
    agra: 450,
    varanasi: 1000,
    patna: 1300,
    amritsar: 240,
    surat: 1400,
    ranchi: 1500,
    visakhapatnam: 2100,
    udaipur: 800,
    jodhpur: 750,
    ludhiana: 150,
    kanpur: 800,
    nagpur: 1400,
    vadodara: 1300,
    rajkot: 1400,
    ooty: 2700,
    darjeeling: 1800,
    shimla: 110,
    cochin: 3000,
    ahmedabad: 1200,
  },

  cochin: {
    delhi: 2700,
    mumbai: 1400,
    bangalore: 500,
    kolkata: 2500,
    chennai: 600,
    pune: 1300,
    hyderabad: 1200,
    jaipur: 2600,
    lucknow: 2400,
    chandigarh: 3000,
    dehradun: 3100,
    agra: 2600,
    varanasi: 2300,
    patna: 2500,
    amritsar: 3150,
    surat: 1500,
    ranchi: 2200,
    visakhapatnam: 1400,
    udaipur: 2200,
    jodhpur: 2300,
    ludhiana: 2900,
    kanpur: 2300,
    nagpur: 1600,
    vadodara: 1600,
    rajkot: 1800,
    ooty: 300,
    darjeeling: 2800,
    shimla: 3100,
    bhubaneswar: 1800,
    ahmedabad: 1900,
  },

  darjeeling: {
    delhi: 1500,
    mumbai: 2200,
    bangalore: 2200,
    kolkata: 600,
    chennai: 2200,
    pune: 2100,
    hyderabad: 1900,
    jaipur: 1800,
    lucknow: 1000,
    chandigarh: 1800,
    dehradun: 1700,
    agra: 1400,
    varanasi: 600,
    patna: 500,
    amritsar: 1950,
    surat: 2200,
    ranchi: 600,
    visakhapatnam: 1500,
    udaipur: 2000,
    jodhpur: 2100,
    ludhiana: 1900,
    kanpur: 1100,
    nagpur: 1500,
    vadodara: 2200,
    rajkot: 2300,
    ooty: 2600,
    shimla: 1900,
    cochin: 2800,
    bhubaneswar: 800,
    ahmedabad: 2100,
  },

  dehradun: {
    delhi: 240,
    mumbai: 1700,
    bangalore: 2500,
    kolkata: 1600,
    chennai: 2600,
    pune: 1800,
    hyderabad: 1800,
    jaipur: 500,
    lucknow: 600,
    chandigarh: 200,
    bhubaneswar: 2100,
    agra: 400,
    varanasi: 900,
    patna: 1200,
    amritsar: 580,
    surat: 1500,
    ranchi: 1400,
    visakhapatnam: 2000,
    udaipur: 900,
    jodhpur: 850,
    ludhiana: 400,
    kanpur: 700,
    nagpur: 1300,
    vadodara: 1400,
    rajkot: 1500,
    ooty: 2800,
    darjeeling: 1700,
    shimla: 200,
    cochin: 3100,
    ahmedabad: 1300,
  },

  delhi: {
    mumbai: 1400,
    manali: 550,
    bangalore: 2150,
    kolkata: 1500,
    chennai: 2200,
    pune: 1450,
    hyderabad: 1550,
    jaipur: 280,
    lucknow: 500,
    chandigarh: 250,
    dehradun: 240,
    agra: 200,
    varanasi: 800,
    patna: 1050,
    bhopal: 780,
    surat: 1180,
    ranchi: 1200,
    visakhapatnam: 1800,
    udaipur: 670,
    jodhpur: 600,
    ludhiana: 310,
    kanpur: 480,
    nagpur: 1080,
    vadodara: 1150,
    rajkot: 1250,
    ooty: 2400,
    darjeeling: 1500,
    shimla: 350,
    cochin: 2700,
    bhubaneswar: 1700,
  },
  // Add these objects inside cityDistances
  goa: {
    delhi: 1850,
    mumbai: 600,
    bangalore: 560,
    kolkata: 2050,
    chennai: 910,
    pune: 450,
    hyderabad: 750,
    jaipur: 1700,
    lucknow: 1800,
    chandigarh: 2100,
    dehradun: 2200,
    agra: 1900,
    varanasi: 1850,
    patna: 2000,
    amritsar: 2400,
    surat: 850,
    ranchi: 1900,
    visakhapatnam: 1200,
    udaipur: 1500,
    jodhpur: 1600,
    ludhiana: 2300,
    kanpur: 1850,
    nagpur: 900,
    vadodara: 800,
    rajkot: 1000,
    ooty: 750,
    darjeeling: 2400,
    shimla: 2300,
    cochin: 800,
    bhubaneswar: 1600,
    ahmedabad: 900,
  },

  hyderabad: {
    delhi: 1550,
    mumbai: 710,
    bangalore: 570,
    kolkata: 1500,
    chennai: 630,
    pune: 560,
    jaipur: 1500,
    lucknow: 1400,
    chandigarh: 1900,
    dehradun: 1800,
    agra: 1400,
    varanasi: 1300,
    patna: 1600,
    bhopal: 850,
    surat: 900,
    ranchi: 1300,
    visakhapatnam: 600,
    udaipur: 1300,
    jodhpur: 1400,
    ludhiana: 2000,
    kanpur: 1300,
    nagpur: 500,
    vadodara: 1000,
    rajkot: 1200,
    ooty: 850,
    darjeeling: 1900,
    shimla: 2000,
    cochin: 1200,
    bhubaneswar: 1000,
    ahmedabad: 1200,
  },

  indore: {
    delhi: 800,
    mumbai: 580,
    bangalore: 1200,
    kolkata: 1600,
    chennai: 1500,
    pune: 550,
    hyderabad: 850,
    jaipur: 650,
    lucknow: 850,
    chandigarh: 1200,
    dehradun: 1300,
    agra: 700,
    varanasi: 900,
    patna: 1300,
    amritsar: 1450,
    surat: 450,
    ranchi: 1200,
    visakhapatnam: 1400,
    udaipur: 400,
    jodhpur: 550,
    ludhiana: 1350,
    kanpur: 800,
    nagpur: 450,
    vadodara: 350,
    rajkot: 650,
    ooty: 1700,
    darjeeling: 1900,
    shimla: 1400,
    cochin: 1700,
    bhubaneswar: 1300,
    ahmedabad: 400,
  },

  jaipur: {
    delhi: 280,
    mumbai: 1140,
    bangalore: 2000,
    kolkata: 1600,
    chennai: 2100,
    pune: 1200,
    hyderabad: 1500,
    lucknow: 580,
    chandigarh: 500,
    dehradun: 500,
    agra: 240,
    varanasi: 800,
    patna: 1200,
    bhopal: 600,
    surat: 900,
    ranchi: 1300,
    visakhapatnam: 1700,
    udaipur: 400,
    jodhpur: 330,
    ludhiana: 650,
    kanpur: 500,
    nagpur: 1000,
    vadodara: 800,
    rajkot: 900,
    ooty: 2200,
    darjeeling: 1800,
    shimla: 650,
    cochin: 2600,
    bhubaneswar: 1800,
    ahmedabad: 640,
  },

  jodhpur: {
    delhi: 600,
    mumbai: 850,
    bangalore: 1700,
    kolkata: 1900,
    chennai: 1800,
    pune: 1000,
    hyderabad: 1400,
    jaipur: 330,
    lucknow: 800,
    chandigarh: 750,
    dehradun: 850,
    agra: 550,
    varanasi: 1100,
    patna: 1500,
    amritsar: 1050,
    surat: 750,
    ranchi: 1600,
    visakhapatnam: 2000,
    udaipur: 250,
    ludhiana: 900,
    kanpur: 850,
    nagpur: 1200,
    vadodara: 650,
    rajkot: 550,
    ooty: 2000,
    darjeeling: 2100,
    shimla: 900,
    cochin: 2300,
    bhubaneswar: 2000,
    ahmedabad: 450,
  },

  kanpur: {
    delhi: 480,
    mumbai: 1300,
    bangalore: 1900,
    kolkata: 1000,
    chennai: 2000,
    pune: 1200,
    hyderabad: 1300,
    jaipur: 500,
    lucknow: 80,
    chandigarh: 800,
    dehradun: 700,
    agra: 250,
    varanasi: 350,
    patna: 600,
    amritsar: 930,
    surat: 1200,
    ranchi: 800,
    visakhapatnam: 1600,
    udaipur: 850,
    jodhpur: 850,
    ludhiana: 850,
    nagpur: 800,
    vadodara: 1100,
    rajkot: 1300,
    ooty: 2200,
    darjeeling: 1100,
    shimla: 900,
    cochin: 2300,
    bhubaneswar: 1200,
    ahmedabad: 1100,
  },

  kerala: {
    delhi: 2700,
    mumbai: 1400,
    bangalore: 500,
    kolkata: 2500,
    chennai: 700,
    pune: 1300,
    hyderabad: 1200,
    jaipur: 2600,
    lucknow: 2400,
    chandigarh: 3000,
    dehradun: 3100,
    agra: 2600,
    varanasi: 2300,
    patna: 2500,
    amritsar: 3150,
    surat: 1500,
    ranchi: 2200,
    visakhapatnam: 1400,
    udaipur: 2200,
    jodhpur: 2300,
    ludhiana: 2900,
    kanpur: 2300,
    nagpur: 1600,
    vadodara: 1600,
    rajkot: 1800,
    ooty: 300,
    darjeeling: 2800,
    shimla: 3100,
    cochin: 150,
    bhubaneswar: 1800,
  },
  mumbai: {
    delhi: 1400,
    bangalore: 980,
    kolkata: 2050,
    chennai: 1330,
    pune: 150,
    hyderabad: 710,
    jaipur: 1140,
    lucknow: 1360,
    chandigarh: 1650,
    dehradun: 1700,
    agra: 1200,
    varanasi: 1500,
    patna: 1800,
    bhopal: 780,
    surat: 270,
    ranchi: 1700,
    visakhapatnam: 1200,
    udaipur: 760,
    jodhpur: 850,
    ludhiana: 1600,
    kanpur: 1300,
    nagpur: 800,
    vadodara: 400,
    rajkot: 700,
    ooty: 1200,
    darjeeling: 2200,
    shimla: 1800,
    cochin: 1400,
    bhubaneswar: 1700,
  },
  kolkata: {
    delhi: 1500,
    mumbai: 2050,
    bangalore: 1870,
    chennai: 1650,
    pune: 2000,
    hyderabad: 1500,
    jaipur: 1600,
    lucknow: 1000,
    chandigarh: 1700,
    dehradun: 1600,
    agra: 1300,
    varanasi: 700,
    patna: 600,
    bhopal: 1400,
    surat: 1900,
    ranchi: 400,
    visakhapatnam: 800,
    udaipur: 1800,
    jodhpur: 1900,
    ludhiana: 1700,
    kanpur: 1000,
    nagpur: 1200,
    vadodara: 2000,
    rajkot: 2100,
    ooty: 2300,
    darjeeling: 600,
    shimla: 1700,
    cochin: 2500,
    bhubaneswar: 400,
  },
  lucknow: {
    delhi: 500,
    mumbai: 1360,
    bangalore: 1900,
    kolkata: 1000,
    chennai: 2000,
    pune: 1300,
    hyderabad: 1400,
    jaipur: 580,
    chandigarh: 700,
    dehradun: 600,
    agra: 330,
    varanasi: 280,
    patna: 500,
    bhopal: 650,
    surat: 1300,
    ranchi: 800,
    visakhapatnam: 1700,
    udaipur: 900,
    jodhpur: 800,
    ludhiana: 900,
    kanpur: 80,
    nagpur: 900,
    vadodara: 1200,
    rajkot: 1400,
    ooty: 2300,
    darjeeling: 1000,
    shimla: 800,
    cochin: 2400,
    bhubaneswar: 1300,
    ahmedabad: 1150,
  },

  ludhiana: {
    delhi: 310,
    mumbai: 1600,
    bangalore: 2400,
    kolkata: 1700,
    chennai: 2500,
    pune: 1600,
    hyderabad: 2000,
    jaipur: 650,
    lucknow: 900,
    chandigarh: 150,
    dehradun: 400,
    agra: 400,
    varanasi: 1100,
    patna: 1400,
    amritsar: 150,
    surat: 1500,
    ranchi: 1600,
    visakhapatnam: 2200,
    udaipur: 1000,
    jodhpur: 900,
    kanpur: 850,
    nagpur: 1500,
    vadodara: 1400,
    rajkot: 1500,
    ooty: 2800,
    darjeeling: 1900,
    shimla: 300,
    cochin: 2900,
    bhubaneswar: 2100,
    ahmedabad: 1300,
  },

  manali: {
    delhi: 550,
    mumbai: 1900,
    bangalore: 2700,
    kolkata: 2100,
    chennai: 2800,
    pune: 1950,
    hyderabad: 2200,
    jaipur: 800,
    lucknow: 1000,
    chandigarh: 300,
    dehradun: 450,
    agra: 750,
    varanasi: 1300,
    patna: 1600,
    amritsar: 400,
    surat: 1700,
    ranchi: 1800,
    visakhapatnam: 2400,
    udaipur: 1200,
    jodhpur: 1100,
    ludhiana: 450,
    kanpur: 1100,
    nagpur: 1700,
    vadodara: 1600,
    rajkot: 1700,
    ooty: 3000,
    darjeeling: 2100,
    shimla: 250,
    cochin: 3200,
    bhubaneswar: 2300,
  },

  nagpur: {
    delhi: 1080,
    mumbai: 800,
    bangalore: 1100,
    kolkata: 1200,
    chennai: 1100,
    pune: 700,
    hyderabad: 500,
    jaipur: 1000,
    lucknow: 900,
    chandigarh: 1400,
    dehradun: 1300,
    agra: 900,
    varanasi: 800,
    patna: 1100,
    bhopal: 350,
    surat: 750,
    ranchi: 900,
    visakhapatnam: 800,
    udaipur: 900,
    jodhpur: 1200,
    ludhiana: 1500,
    kanpur: 800,
    vadodara: 800,
    rajkot: 1000,
    ooty: 1400,
    darjeeling: 1500,
    shimla: 1600,
    cochin: 1600,
    bhubaneswar: 1000,
    ahmedabad: 850,
  },

  ooty: {
    delhi: 2400,
    mumbai: 1200,
    bangalore: 270,
    kolkata: 2300,
    chennai: 500,
    pune: 1100,
    hyderabad: 850,
    jaipur: 2200,
    lucknow: 2300,
    chandigarh: 2700,
    dehradun: 2800,
    agra: 2300,
    varanasi: 2200,
    patna: 2400,
    bhopal: 1600,
    surat: 1300,
    ranchi: 2000,
    visakhapatnam: 1300,
    udaipur: 1900,
    jodhpur: 2000,
    ludhiana: 2800,
    kanpur: 2200,
    nagpur: 1400,
    vadodara: 1500,
    rajkot: 1700,
    darjeeling: 2600,
    shimla: 2900,
    cochin: 300,
    bhubaneswar: 1700,
    ahmedabad: 1800,
  },

  patna: {
    delhi: 1050,
    mumbai: 1800,
    bangalore: 2100,
    kolkata: 600,
    chennai: 2100,
    pune: 1700,
    hyderabad: 1600,
    jaipur: 1200,
    lucknow: 500,
    chandigarh: 1300,
    dehradun: 1200,
    agra: 900,
    varanasi: 250,
    bhopal: 1100,
    surat: 1700,
    ranchi: 400,
    visakhapatnam: 1300,
    udaipur: 1500,
    jodhpur: 1500,
    ludhiana: 1400,
    kanpur: 600,
    nagpur: 1100,
    vadodara: 1800,
    rajkot: 1900,
    ooty: 2400,
    darjeeling: 500,
    shimla: 1500,
    cochin: 2500,
    bhubaneswar: 850,
    ahmedabad: 1600,
  },

  pune: {
    delhi: 1450,
    mumbai: 150,
    bangalore: 840,
    kolkata: 2000,
    chennai: 1200,
    hyderabad: 560,
    jaipur: 1200,
    lucknow: 1300,
    chandigarh: 1700,
    dehradun: 1800,
    agra: 1300,
    varanasi: 1600,
    patna: 1700,
    bhopal: 780,
    surat: 400,
    ranchi: 1600,
    visakhapatnam: 1000,
    udaipur: 900,
    jodhpur: 1000,
    ludhiana: 1600,
    kanpur: 1200,
    nagpur: 700,
    vadodara: 500,
    rajkot: 800,
    ooty: 1100,
    darjeeling: 2100,
    shimla: 1900,
    cochin: 1300,
    bhubaneswar: 1600,
    ahmedabad: 660,
  },

  rajkot: {
    delhi: 1250,
    mumbai: 700,
    bangalore: 1500,
    kolkata: 2100,
    chennai: 1600,
    pune: 800,
    hyderabad: 1200,
    jaipur: 900,
    lucknow: 1400,
    chandigarh: 1400,
    dehradun: 1500,
    agra: 1100,
    varanasi: 1600,
    patna: 1900,
    bhopal: 850,
    surat: 450,
    ranchi: 1800,
    visakhapatnam: 1700,
    udaipur: 650,
    jodhpur: 550,
    ludhiana: 1500,
    kanpur: 1300,
    nagpur: 1000,
    vadodara: 250,
    ooty: 1700,
    darjeeling: 2300,
    shimla: 1600,
    cochin: 1800,
    bhubaneswar: 1900,
    ahmedabad: 220,
  },

  ranchi: {
    delhi: 1200,
    mumbai: 1700,
    bangalore: 1800,
    kolkata: 400,
    chennai: 1800,
    pune: 1600,
    hyderabad: 1300,
    jaipur: 1300,
    lucknow: 800,
    chandigarh: 1500,
    dehradun: 1400,
    agra: 1000,
    varanasi: 500,
    patna: 400,
    bhopal: 1000,
    surat: 1600,
    visakhapatnam: 900,
    udaipur: 1600,
    jodhpur: 1600,
    ludhiana: 1600,
    kanpur: 800,
    nagpur: 900,
    vadodara: 1700,
    rajkot: 1800,
    ooty: 2000,
    darjeeling: 600,
    shimla: 1700,
    cochin: 2200,
    bhubaneswar: 500,
    ahmedabad: 1500,
  },

  shimla: {
    delhi: 350,
    mumbai: 1800,
    bangalore: 2500,
    kolkata: 1700,
    chennai: 2600,
    pune: 1900,
    hyderabad: 2000,
    jaipur: 650,
    lucknow: 800,
    chandigarh: 110,
    dehradun: 200,
    agra: 300,
    varanasi: 1100,
    patna: 1500,
    bhopal: 1150,
    surat: 1600,
    ranchi: 1700,
    visakhapatnam: 2300,
    udaipur: 1100,
    jodhpur: 900,
    ludhiana: 300,
    kanpur: 900,
    nagpur: 1600,
    vadodara: 1500,
    rajkot: 1600,
    ooty: 2900,
    darjeeling: 1900,
    cochin: 3100,
    bhubaneswar: 2100,
    ahmedabad: 1350,
  },

  surat: {
    delhi: 1180,
    mumbai: 270,
    bangalore: 1200,
    kolkata: 1900,
    chennai: 1400,
    pune: 400,
    hyderabad: 900,
    jaipur: 900,
    lucknow: 1300,
    chandigarh: 1400,
    dehradun: 1500,
    agra: 1100,
    varanasi: 1400,
    patna: 1700,
    bhopal: 700,
    ranchi: 1600,
    visakhapatnam: 1400,
    udaipur: 600,
    jodhpur: 750,
    ludhiana: 1500,
    kanpur: 1200,
    nagpur: 750,
    vadodara: 250,
    rajkot: 450,
    ooty: 1300,
    darjeeling: 2200,
    shimla: 1600,
    cochin: 1500,
    bhubaneswar: 1600,
    ahmedabad: 260,
  },
  udaipur: {
    delhi: 670,
    mumbai: 760,
    bangalore: 1600,
    kolkata: 1800,
    chennai: 1700,
    pune: 900,
    hyderabad: 1300,
    jaipur: 400,
    lucknow: 900,
    chandigarh: 800,
    dehradun: 900,
    agra: 600,
    varanasi: 1200,
    patna: 1500,
    bhopal: 550,
    surat: 600,
    ranchi: 1600,
    visakhapatnam: 1900,
    amritsar: 1120,
    jodhpur: 250,
    ludhiana: 1000,
    kanpur: 850,
    nagpur: 900,
    vadodara: 450,
    rajkot: 650,
    ooty: 1900,
    darjeeling: 2000,
    shimla: 1100,
    cochin: 2200,
    bhubaneswar: 1900,
    ahmedabad: 250,
  },

  varanasi: {
    delhi: 800,
    mumbai: 1500,
    bangalore: 1900,
    kolkata: 700,
    chennai: 1900,
    pune: 1600,
    hyderabad: 1300,
    jaipur: 800,
    lucknow: 280,
    chandigarh: 1000,
    dehradun: 900,
    agra: 600,
    patna: 250,
    bhopal: 800,
    surat: 1400,
    ranchi: 500,
    visakhapatnam: 1400,
    udaipur: 1200,
    jodhpur: 1100,
    ludhiana: 1100,
    kanpur: 350,
    nagpur: 800,
    vadodara: 1300,
    rajkot: 1600,
    ooty: 2200,
    darjeeling: 600,
    shimla: 1100,
    cochin: 2300,
    bhubaneswar: 900,
    ahmedabad: 1300,
  },

  vadodara: {
    delhi: 1150,
    mumbai: 400,
    bangalore: 1300,
    kolkata: 2000,
    chennai: 1500,
    pune: 500,
    hyderabad: 1000,
    jaipur: 800,
    lucknow: 1200,
    chandigarh: 1300,
    dehradun: 1400,
    agra: 1000,
    varanasi: 1300,
    patna: 1800,
    bhopal: 650,
    surat: 250,
    ranchi: 1700,
    visakhapatnam: 1500,
    udaipur: 450,
    jodhpur: 650,
    ludhiana: 1400,
    kanpur: 1100,
    nagpur: 800,
    rajkot: 250,
    ooty: 1500,
    darjeeling: 2200,
    shimla: 1500,
    cochin: 1600,
    bhubaneswar: 1700,
    ahmedabad: 100,
  },

  visakhapatnam: {
    delhi: 1800,
    mumbai: 1200,
    bangalore: 1200,
    kolkata: 800,
    chennai: 800,
    pune: 1000,
    hyderabad: 600,
    jaipur: 1700,
    lucknow: 1700,
    chandigarh: 2100,
    dehradun: 2000,
    agra: 1600,
    varanasi: 1400,
    patna: 1300,
    bhopal: 1200,
    surat: 1400,
    ranchi: 900,
    udaipur: 1900,
    jodhpur: 2000,
    ludhiana: 2200,
    kanpur: 1600,
    nagpur: 800,
    vadodara: 1500,
    rajkot: 1700,
    ooty: 1300,
    darjeeling: 1500,
    shimla: 2300,
    cochin: 1400,
    bhubaneswar: 450,
    ahmedabad: 1600,
  },
  chennai: {
    delhi: 2200,
    mumbai: 1330,
    bangalore: 350,
    kolkata: 1650,
    pune: 1200,
    hyderabad: 630,
    jaipur: 2100,
    lucknow: 2000,
    chandigarh: 2500,
    dehradun: 2600,
    agra: 2200,
    varanasi: 1900,
    patna: 2100,
    bhopal: 1400,
    surat: 1400,
    ranchi: 1800,
    visakhapatnam: 800,
    udaipur: 1700,
    jodhpur: 1800,
    ludhiana: 2500,
    kanpur: 2000,
    nagpur: 1100,
    vadodara: 1500,
    rajkot: 1600,
    ooty: 500,
    darjeeling: 2200,
    shimla: 2600,
    cochin: 600,
    bhubaneswar: 1200,
  },
};

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

// Display trip details
const tripDistance = cityDistances[from]?.[to] || 0; // Get distance between cities or default to 0
if (tripDistance === undefined) {
  alert(
    `Distance between ${capitalize(from)} and ${capitalize(
      to
    )} is not available.`
  );
  window.location.href = "index1.html"; // Redirect to the main page
}
document.getElementById(
  "destination-title"
).innerText = `Your Trip to ${capitalize(to)}`;

document.getElementById("trip-details").innerText = `From: ${capitalize(
  from
)}, To: ${capitalize(
  to
)}, Distance: ${tripDistance} km, Departure: ${departure}, Return: ${returnDate}, Duration: ${tripDays} days, Adults: ${adults}, Children: ${children}`;

document.getElementById("destination-name").innerText = capitalize(to);

const placesToVisit = {
  agra: {
    places: [
      "Agra Fort",
      "Fatehpur Sikri",
      "Itmad-ud-Daula's Tomb",
      "Mehtab Bagh",
      "Taj Mahal"
    ]
  },
  ahmedabad: {
    places: [
      "Adalaj Stepwell",
      "Kankaria Lake",
      "Manek Chowk",
      "Sabarmati Ashram",
      "Sidi Saiyyed Mosque"
    ]
  },
  amritsar: {
    places: [
      "Golden Temple",
      "Jallianwala Bagh",
      "Wagah Border", 
      "Durgiana Temple",
      "Gobindgarh Fort"
    ]
  },
  bhopal: {
    places: [
      "Bhojtal Lake",
      "Sanchi Stupa",
      "Van Vihar National Park",
      "Madhya Pradesh Tribal Museum",
      "Upper Lake"
    ]
  },
  bangalore: {
    places: [
      "Bannerghatta National Park",
      "Bangalore Palace",
      "Cubbon Park",
      "ISKCON Temple",
      "Lalbagh Botanical Garden"
    ]
  },
  bhubaneswar: {
    places: [
      "Dhauli Shanti Stupa",
      "Lingaraj Temple",
      "Nandankanan Zoo",
      "Rajarani Temple",
      "Udayagiri and Khandagiri Caves"
    ]
  },  chandigarh: {
    places: [
      "Capitol Complex",
      "Pinjore Gardens",
      "Rock Garden",
      "Rose Garden",
      "Sukhna Lake"
    ]
  },
  chennai: {
    places: [
      "Elliot's Beach",
      "Guindy National Park",
      "Kapaleeshwarar Temple",
      "Marina Beach",
      "Santhome Basilica"
    ]
  },
  cochin: {
    places: [
      "Chinese Fishing Nets",
      "Fort Kochi Beach",
      "Mattancherry Palace",
      "Santa Cruz Basilica",
      "Jewish Synagogue"
    ]
  },
  coimbatore: {
    places: [
      "Dhyanalinga Temple",
      "ISHA Yoga Center",
      "Kovai Kutralam Falls",
      "Marudhamalai Temple",
      "VOC Park and Zoo"
    ]
  },
  darjeeling: {
    places: [
      "Batasia Loop",
      "Darjeeling Himalayan Railway",
      "Padmaja Naidu Zoo",
      "Peace Pagoda",
      "Tiger Hill"
    ]
  },
  dehradun: {
    places: [
      "Forest Research Institute",
      "Mindrolling Monastery",
      "Robber's Cave",
      "Sahastradhara",
      "Tapkeshwar Temple"
    ]
  },  delhi: {
    places: [
      "Humayun's Tomb",
      "India Gate",
      "Lotus Temple",
      "Qutub Minar",
      "Red Fort"
    ]
  },
  goa: {
    places: [
      "Anjuna Beach",
      "Baga Beach",
      "Chapora Fort",
      "Dudhsagar Waterfalls",
      "Fort Aguada"
    ]
  },
  hyderabad: {
    places: [
      "Charminar",
      "Golconda Fort",
      "Hussain Sagar Lake",
      "Ramoji Film City",
      "Salar Jung Museum"
    ]
  },  indore: {
    places: [
      "Rajwada Palace",
      "Lal Bagh Palace",
      "Sarafa Bazaar",
      "Annapurna Temple",
      "Kanch Mandir"
    ]
  },
  jaipur: {
    places: [
      "Amber Fort",
      "City Palace",
      "Hawa Mahal",
      "Jantar Mantar",
      "Nahargarh Fort"
    ]
  },
  jodhpur: {
    places: [
      "Clock Tower",
      "Jaswant Thada",
      "Mandore Gardens",
      "Mehrangarh Fort",
      "Umaid Bhawan Palace"
    ]
  },  kanpur: {
    places: [
      "Allen Forest Zoo",
      "Blue World Theme Park",
      "JK Temple",
      "Moti Jheel",
      "Nana Rao Park"
    ]
  },
  kerala: {
    places: [
      "Alleppey Backwaters",
      "Kumarakom",
      "Munnar Tea Gardens",
      "Periyar Wildlife Sanctuary",
      "Varkala Beach"
    ]
  },
  kolkata: {
    places: [
      "Dakshineswar Kali Temple",
      "Eden Gardens",
      "Howrah Bridge",
      "Indian Museum",
      "Victoria Memorial"
    ]
  },  lucknow: {
    places: [
      "Ambedkar Memorial Park",
      "Bara Imambara",
      "Chota Imambara",
      "Hazratganj",
      "Rumi Darwaza"
    ]
  },
  ludhiana: {
    places: [
      "Hardy's World",
      "Nehru Rose Garden",
      "Phillaur Fort",
      "Punjab Agricultural University Museum",
      "Rakh Bagh Park"
    ]
  },
  manali: {
    places: [
      "Hadimba Temple",
      "Rohtang Pass",
      "Solang Valley",
      "Vashisht Hot Springs",
      "Mall Road"
    ]
  },
  mumbai: {
    places: [
      "Chhatrapati Shivaji Terminus",
      "Elephanta Caves",
      "Gateway of India",
      "Juhu Beach",
      "Marine Drive"
    ]
  },  nagpur: {
    places: [
      "Ambazari Lake",
      "Deekshabhoomi",
      "Futala Lake",
      "Raman Science Centre",
      "Sitabuldi Fort"
    ]
  },
  ooty: {
    places: [
      "Botanical Gardens",
      "Doddabetta Peak",
      "Ooty Lake",
      "Pykara Falls",
      "Rose Garden"
    ]
  },
  patna: {
    places: [
      "Agam Kuan",
      "Bihar Museum",
      "Eco Park",
      "Golghar",
      "Patna Sahib Gurudwara"
    ]
  },
  pune: {
    places: [
      "Aga Khan Palace",
      "Osho Ashram",
      "Pataleshwar Cave Temple",
      "Shaniwar Wada",
      "Sinhagad Fort"
    ]
  },vadodara: {
    places: [
      "Ajwa Water Park",
      "Baroda Museum",
      "EME Temple",
      "Laxmi Vilas Palace",
      "Sayaji Garden"
    ]
  },
  varanasi: {
    places: [
      "Alamgir Mosque",
      "Assi Ghat",
      "Banaras Hindu University",
      "Dashashwamedh Ghat",
      "Durga Temple",
      "Evening Ganga Aarti",
      "Kashi Vishwanath Temple",
      "Manikarnika Ghat",
      "Ramnagar Fort",
      "Sarnath"
    ]
  },
  visakhapatnam: {
    places: [
      "Araku Valley",
      "Borra Caves",
      "INS Kursura Submarine Museum",
      "Kailasagiri",
      "RK Beach"
    ]
  }
};

// Update places list
const placesList = document.getElementById("places-list");
if (placesToVisit[to]?.places) {
  const placesHtml = placesToVisit[to].places
    .map(place => `<li>${place}</li>`)
    .join('');
  placesList.innerHTML = placesHtml;
} else {
  placesList.innerHTML = "<li>No data available for this destination</li>";
}
// Estimated fare logic based on distance (in kilometers)

const baseFarePerKm = {
  Train: 0.5, // ₹0.5 per km for trains
  Bus: 1.3, // ₹0.3 per km for buses
};

// Function to calculate fare based on distance and transport mode
function calculateFare(from, to, mode) {
  const distance = cityDistances[from]?.[to] || 0; // Get distance between cities
  const baseFare = baseFarePerKm[mode]; // Get base fare per km for the selected mode
  if (!baseFare) {
    throw new Error(`Invalid transport mode: ${mode}`);
  }
  return distance * baseFare; // Total fare for one adult
}

// Hotel and Food Cost Estimates
const hotelCostPerDay = 2000; // ₹2000 per day for hotel
const foodCostPerDay = 500; // ₹500 per person per day for food

function selectTransport(mode) {
  const costContainer = document.getElementById("cost-container");
  const fareBox = document.getElementById("fare-box");
  const hotelFoodBox = document.getElementById("hotel-food-box");
  const totalCostBox = document.getElementById("total-cost");
  const bookNowBtn = document.getElementById("book-now");

  let transportFare = 0;

  if (mode === "Flight") {
    // Calculate flight fare using our local logic
    const flightDetails = calculateFlightFareWithDetails(from, to, departure, returnDate);
    
    // Calculate total fare for all passengers
    const adultFare = flightDetails.fare;
    const childFare = Math.round(flightDetails.fare * 0.6); // Children get 40% discount
    transportFare = (adultFare * adults) + (childFare * children);

    // Show detailed fare breakdown
    fareBox.innerHTML = `
      <strong>Flight Fare Breakdown:</strong><br>
      Base Fare: ₹${flightDetails.baseFare.toLocaleString()}<br>
      Taxes & Fees: ₹${flightDetails.fareBreakdown.gst.toLocaleString()} (GST)<br>
      Fuel Surcharge: ₹${flightDetails.fareBreakdown.fuelSurcharge.toLocaleString()}<br>
      Airport Charges: ₹${flightDetails.fareBreakdown.airportCharges.toLocaleString()}<br>
      Total per Adult: ₹${adultFare.toLocaleString()}<br>
      Total per Child: ₹${childFare.toLocaleString()}<br>
      <hr>
      Total for ${adults} Adult(s) and ${children} Child(ren): ₹${transportFare.toLocaleString()}
    `;
  } else {
    // Calculate fare for Train or Bus
    transportFare =
      calculateFare(from, to, mode) * adults +
      calculateFare(from, to, mode) * children * 0.5;
  }

  // Hotel Cost Calculation
  const totalHotelCost = tripDays * hotelCostPerDay;

  // Food Cost Calculation
  const totalFoodCost = tripDays * foodCostPerDay * (adults + children);

  // Grand Total Calculation
  const grandTotal = transportFare + totalHotelCost + totalFoodCost;

  // Display Cost Container
  costContainer.style.display = "block";

  // Update Cost Details
  fareBox.innerHTML = `Estimated ${mode} Fare: ₹${transportFare.toLocaleString()}`;

  hotelFoodBox.innerHTML = `
      <strong>Hotel & Food Costs:</strong><br>
      Hotel (₹${hotelCostPerDay}/day): ₹${totalHotelCost.toLocaleString()}<br>
      Food (₹${foodCostPerDay}/person/day): ₹${totalFoodCost.toLocaleString()}
  `;

  totalCostBox.innerHTML = `Grand Total: ₹${grandTotal.toLocaleString()}`;

  // Store selected mode & costs in session storage
  sessionStorage.setItem("selectedTransport", mode);
  sessionStorage.setItem("transportFare", transportFare);
  sessionStorage.setItem("hotelCost", totalHotelCost);
  sessionStorage.setItem("foodCost", totalFoodCost);
  sessionStorage.setItem("grandTotal", grandTotal);

  // Show "Book Now" button
  bookNowBtn.style.display = "block";
}

// Function to redirect on "Book Now" click
function redirectToBooking() {
  const transport = sessionStorage.getItem("selectedTransport");
  const fare = sessionStorage.getItem("transportFare");
  const hotel = sessionStorage.getItem("hotelCost");
  const food = sessionStorage.getItem("foodCost");
  const total = sessionStorage.getItem("grandTotal");

  window.location.href = `booking.html?from=${from}&to=${to}&departure=${departure}&return=${returnDate}&adults=${adults}&children=${children}&transport=${transport}&fare=${fare}&hotel=${hotel}&food=${food}&total=${total}`;
}
