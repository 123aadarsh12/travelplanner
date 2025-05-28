const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = 3000;

app.get("/getFare", async (req, res) => {
  const { from, to, mode } = req.query;
  let apiUrl = "";

  if (mode === "Flight") {
    apiUrl = `https://api.example.com/flights?from=${from}&to=${to}`;
  } else if (mode === "Train") {
    apiUrl = `https://api.example.com/trains?from=${from}&to=${to}`;
  } else if (mode === "Bus") {
    apiUrl = `https://api.example.com/buses?from=${from}&to=${to}`;
  }

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json({ success: true, fare: data.fare });
  } catch (error) {
    res.json({ success: false, error: "API Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
