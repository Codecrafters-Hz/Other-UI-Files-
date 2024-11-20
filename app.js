// Base URL of the backend
const BASE_URL = "http://localhost:3000";

// Fetch initial data
async function fetchData() {
  const response = await fetch(`${BASE_URL}/data`);
  const data = await response.json();

  // Populate chart and UI
  resistanceChart.data.labels = data.map(entry => new Date(entry.timestamp).toLocaleTimeString());
  resistanceChart.data.datasets[0].data = data.map(entry => entry.resistance);
  resistanceChart.update();

  if (data.length > 0) {
    const latest = data[data.length - 1];
    avgVoltageElement.textContent = latest.voltage.toFixed(2);
    forceElement.textContent = latest.force.toFixed(2);
    resistanceChangeElement.textContent = latest.resistance.toFixed(2);
    statusElement.textContent = latest.status || "Not Started";
  }
}

// Send data to backend
async function sendData(resistance, voltage, force, status) {
  await fetch(`${BASE_URL}/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resistance, voltage, force, status }),
  });
}

// Update status
async function updateStatus(status) {
  await fetch(`${BASE_URL}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

// Start calibration
startBtn.addEventListener("click", async () => {
  calibrationInProgress = true;
  statusElement.textContent = "In Progress";
  await updateStatus("In Progress");

  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;

  collectData();
});

// Stop calibration
stopBtn.addEventListener("click", async () => {
  calibrationInProgress = false;
  statusElement.textContent = "Finished";
  await updateStatus("Finished");

  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Reset calibration
resetBtn.addEventListener("click", async () => {
  calibrationInProgress = false;
  resistanceData = [];
  resistanceChart.data.labels = [];
  resistanceChart.data.datasets[0].data = [];
  resistanceChart.update();

  await updateStatus("Not Started");

  avgVoltage = 0;
  forceValue = 0;
  resistanceChange = 0;

  avgVoltageElement.textContent = avgVoltage;
  forceElement.textContent = forceValue;
  resistanceChangeElement.textContent = resistanceChange;
  statusElement.textContent = "Not Started";

  startBtn.disabled = false;
  stopBtn.disabled = true;
  resetBtn.disabled = true;
});

// Collect and send data
function collectData() {
  if (!calibrationInProgress) return;

  const resistance = Math.random() * 10; // Simulated resistance
  const voltage = Math.random() * 5; // Simulated voltage
  const force = Math.random() * 50; // Simulated force

  sendData(resistance, voltage, force, "In Progress");

  // Update chart and values
  const time = new Date().toLocaleTimeString();
  resistanceChart.data.labels.push(time);
  resistanceChart.data.datasets[0].data.push(resistance);
  resistanceChart.update();

  avgVoltageElement.textContent = voltage.toFixed(2);
  forceElement.textContent = force.toFixed(2);
  resistanceChangeElement.textContent = resistance.toFixed(2);

  setTimeout(collectData, 1000);
}

// Initial load
fetchData();
