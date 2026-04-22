const axios = require("axios");
require("dotenv").config();

const testKey = async () => {
  const key = process.env.OPENWEATHER_API_KEY;
  console.log(`Testing key: ${key.substring(0, 5)}...`);
  try {
    const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: { q: "London", appid: key }
    });
    console.log("✅ Key is ACTIVE! Weather in London:", res.data.weather[0].description);
  } catch (err) {
    console.error("❌ Key is NOT active or invalid.");
    console.error("Status Code:", err.response?.status);
    console.error("Message:", err.response?.data?.message);
    console.log("\nPossible reasons:");
    console.log("1. New key (takes 2 hours to activate)");
    console.log("2. Incorrect key copied");
    console.log("3. Subscription required for specific API (e.g. OneCall 3.0)");
  }
};

testKey();
