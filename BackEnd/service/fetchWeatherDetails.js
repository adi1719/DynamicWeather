require("dotenv").config();
const axios = require("axios");
const {
  findMinMaxAvgtemperatureByTimestamp,
  saveOrUpdate,
} = require("../db/queries");
const getWeatherDetails = async (city) => {
  const { weather, main, dt, name } = await apiCallWeatherDetails(city);

  const currWeather = await saveOrUpdate({
    description: weather[0].description,
    temp: main.temp,
    timestamp: dt,
    type: weather[0].main,
    name: name,
  });

  const result = await findMinMaxAvgtemperatureByTimestamp(
    getMidnightTimestamp(),
    name
  );
  const minTemp = result.min;
  const maxTemp = result.max;
  const avgTemp = result.avg;

  return {
    type: currWeather.type,
    temp: currWeather.temperature,
    minTemp,
    maxTemp,
    feelsLike: main.feels_like,
    description: currWeather.description,
    city,
    avgTemp,
  };
};

const apiCallWeatherDetails = async (city) => {
  const apiKey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const { data } = await axios.get(url);
  return data;
};

const getMidnightTimestamp = () => new Date().setHours(0, 0, 0, 0) / 1000;

module.exports = { apiCallWeatherDetails, getWeatherDetails };