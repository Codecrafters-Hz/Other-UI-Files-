const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Initialize app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/calibrationDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema and model
const CalibrationSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  resistance: Number,
  voltage: Number,
  force: Number,
  status: String,
});

const Calibration = mongoose.model("Calibration", CalibrationSchema);

// Endpoints

// Fetch all data
app.get("/data", async (req, res) => {
  const data = await Calibration.find().sort({ timestamp: 1 });
  res.json(data);
});

// Save new data
app.post("/data", async (req, res) => {
  const { resistance, voltage, force, status } = req.body;

  const newEntry = new Calibration({ resistance, voltage, force, status });
  await newEntry.save();

  res.json({ success: true, message: "Data saved successfully!" });
});

// Update status
app.post("/status", async (req, res) => {
  const { status } = req.body;
  await Calibration.updateMany({}, { status });
  res.json({ success: true, message: "Status updated successfully!" });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
