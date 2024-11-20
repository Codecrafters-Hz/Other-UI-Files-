// Mock data and variables
let calibrationInProgress = false;
let resistanceData = [];
let resistanceChange = 0;
let avgVoltage = 0;
let forceValue = 0;

const statusElement = document.getElementById("calibration-status");
const avgVoltageElement = document.getElementById("avg-voltage");
const forceElement = document.getElementById("force-value");
const resistanceChangeElement = document.getElementById("resistance-change");
const startBtn = document.getElementById("start-calibration");
const stopBtn = document.getElementById("stop-calibration");
const resetBtn = document.getElementById("reset-calibration");

// Chart setup
const ctx = document.getElementById("resistance-chart").getContext("2d");
const resistanceChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [], // Time or event labels
    datasets: [
      {
        label: "Resistance Change (Ω)",
        data: [],
        borderColor: "blue",
        borderWidth: 2,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: { title: { display: true, text: "Resistance (Ω)" } },
    },
  },
});

// Start calibration
startBtn.addEventListener("click", () => {
  calibrationInProgress = true;
  statusElement.textContent = "In Progress";
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;

  // Simulate data collection
  collectData();
});

// Stop calibration
stopBtn.addEventListener("click", () => {
  calibrationInProgress = false;
  statusElement.textContent = "Finished";
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Reset calibration
resetBtn.addEventListener("click", () => {
  calibrationInProgress = false;
  resistanceData = [];
  resistanceChange = 0;
  avgVoltage = 0;
  forceValue = 0;

  statusElement.textContent = "Not Started";
  avgVoltageElement.textContent = avgVoltage;
  forceElement.textContent = forceValue;
  resistanceChangeElement.textContent = resistanceChange;

  resistanceChart.data.labels = [];
  resistanceChart.data.datasets[0].data = [];
  resistanceChart.update();

  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = true;
});

// Simulate data collection
function collectData() {
  if (!calibrationInProgress) return;

  // Generate mock values
  const time = new Date().toLocaleTimeString();
  resistanceChange = Math.random() * 10; // Simulated resistance
  avgVoltage = Math.random() * 5; // Simulated voltage
  forceValue = Math.random() * 50; // Simulated force

  // Update chart and values
  resistanceData.push(resistanceChange);
  resistanceChart.data.labels.push(time);
  resistanceChart.data.datasets[0].data.push(resistanceChange);
  resistanceChart.update();

  avgVoltageElement.textContent = avgVoltage.toFixed(2);
  forceElement.textContent = forceValue.toFixed(2);
  resistanceChangeElement.textContent = resistanceChange.toFixed(2);

  // Continue collecting data
  setTimeout(collectData, 1000);
}
