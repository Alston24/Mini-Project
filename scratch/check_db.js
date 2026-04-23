const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const checkAlerts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const count = await db.collection("alerts").countDocuments();
    console.log(`Current alerts in DB: ${count}`);
    const samples = await db.collection("alerts").find().limit(3).toArray();
    console.log("Sample alerts:", JSON.stringify(samples, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAlerts();
