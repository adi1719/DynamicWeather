const backendUrl = "http://localhost:8000";
const apiKey = "38b7407fbdb233c5be49085f145985ae";
const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bengaluru",
  "Kolkata",
  "Hyderabad",
];

function getCurrentDateTime() {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return now.toLocaleDateString("en-US", options);
}

async function fetchCurrentWeather() {
  const weatherContainer = document.getElementById("current-weather");
  weatherContainer.innerHTML = "";

  for (const city of cities) {
    try {
      const response = await fetch(`${backendUrl}/weather-detail?city=${city}`);
      const result = await response.json();
      const data = result.data;

      const card = document.createElement("div");
      card.className = "weather-card";
      card.innerHTML = `
                <h3>${data.city}</h3>
                <div class="weather-info">
                    <div>
                        <div class="temperature">${data.minTemp}°C - ${
        data.maxTemp
      }°C</div>
                        <div class="feels-like">Feels like: ${
                          data.feelsLike
                        }°C</div>
                        <div class="datetime">${
                          data.dt || getCurrentDateTime()
                        }</div>
                    </div>
                    <div class="condition">${data.type}</div>
                </div>
            `;
      weatherContainer.appendChild(card);
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
    }
  }
}

async function fetchWeatherAverages() {
  const cityData = [];

  for (const city of cities) {
    const response = await fetch(`${backendUrl}/weather-detail?city=${city}`);
    const result = await response.json();
    if (result.success) {
      cityData.push({
        city: result.data.city,
        avgTemp: result.data.avgTemp,
        feelsLike: result.data.feelsLike,
      });
    }
  }

  const ctx = document.getElementById("averages-chart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: cityData.map((city) => city.city),
      datasets: [
        {
          label: "Average Temperature (°C)",
          data: cityData.map((city) => city.avgTemp),
          backgroundColor: "rgba(52, 152, 219, 0.6)",
          borderColor: "rgba(52, 152, 219, 1)",
          borderWidth: 1,
        },
        {
          label: "Feels Like Temperature (°C)",
          data: cityData.map((city) => city.feelsLike),
          backgroundColor: "rgba(231, 76, 60, 0.6)",
          borderColor: "rgba(231, 76, 60, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Temperature (°C)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Cities",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Average Temperatures by City",
        },
      },
    },
  });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

let dailySummaryChart = null;

async function fetchDailySummary() {
  const city = document.getElementById("city-select").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const response = await fetch(
    `${backendUrl}/weather-history/${city}?start_date=${formattedStartDate}&end_date=${formattedEndDate}`
  );
  const result = await response.json();

  if (result.success) {
    const data = result.data;
    const labels = data.map((d) => d.day);
    const avgTemps = data.map((d) => d.avg_temperature);
    const maxTemps = data.map((d) => d.max_temperature);
    const minTemps = data.map((d) => d.min_temperature);

    const ctx = document.getElementById("daily-summary-chart").getContext("2d");

    if (dailySummaryChart) {
      dailySummaryChart.data.labels = labels;
      dailySummaryChart.data.datasets[0].data = avgTemps;
      dailySummaryChart.data.datasets[1].data = maxTemps;
      dailySummaryChart.data.datasets[2].data = minTemps;
      dailySummaryChart.options.plugins.title.text = `Daily Weather Summary for ${city}`;
      dailySummaryChart.update();
    } else {
      dailySummaryChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Average Temperature",
              data: avgTemps,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
            {
              label: "Max Temperature",
              data: maxTemps,
              borderColor: "rgb(255, 99, 132)",
              tension: 0.1,
            },
            {
              label: "Min Temperature",
              data: minTemps,
              borderColor: "rgb(54, 162, 235)",
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Temperature (°C)",
              },
            },
            x: {
              title: {
                display: true,
                text: "Date",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: `Daily Weather Summary for ${city}`,
            },
          },
        },
      });
    }
  } else {
    console.error("Failed to fetch weather data:", result.message);
  }
}

async function fetchAlerts() {
  try {
    const response = await fetch(`${backendUrl}/get-alerts`);
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      const alertsContainer = document.getElementById("alerts-body");
      alertsContainer.innerHTML = "";
      result.data.forEach((alert, index) => {
        const alertElement = document.createElement("tr");
        alertElement.className = "alert-item";
        alertElement.innerHTML = `
                  <td>${index + 1}</td> 
                  <td>${alert.email}</td>
                  <td>${alert.thresold !== null ? alert.thresold : "N/A"}</td>
                  <td>${alert.city}</td>
                  <td><button onclick="removeAlert(${
                    alert.id
                  })">Remove</button></td>
              `;
        alertsContainer.appendChild(alertElement);
      });
    } else {
      console.error("Expected data to be an array, but got:", result.data);
    }
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
  }
}

async function createAlert(event) {
  event.preventDefault();
  const email = document.getElementById("alert-email").value;
  const thresholdTemperature = document.getElementById(
    "threshold-temperature"
  ).value;
  const city = document.getElementById("alert-city").value;

  const response = await fetch(`${backendUrl}/add-alert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      thresoldTemperature: thresholdTemperature,
      city: city,
    }),
  });

  const result = await response.json();
  if (result.success) {
    fetchAlerts();
  } else {
    console.error("Failed to create alert:", result.message);
  }
}

async function removeAlert(id) {
  const response = await fetch(`${backendUrl}/remove-alert/${id}`, {
    method: "GET",
  });
  console.log(response);
  const result = await response.json();
  if (result.success) {
    fetchAlerts();
  } else {
    console.error("Failed to remove alert:", result.message);
  }
}

function initializeCitySelect() {
  const citySelect = document.getElementById("city-select");

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

initializeCitySelect();
fetchCurrentWeather();
fetchWeatherAverages();
fetchAlerts();
setInterval(fetchCurrentWeather, 300000);
setInterval(fetchWeatherAverages, 300000);
setInterval(fetchAlerts, 300000);
