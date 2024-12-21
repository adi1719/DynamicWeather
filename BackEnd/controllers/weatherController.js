const axios = require("axios");
const { getTemperatureStatsInDateRange } = require("../db/queries");
const {getWeatherDetails}=require("../service/fetchWeatherDetails");
const getTimestamps=require("../utils/dateParser");
exports.weatherDetails = async (req, res) => {
  try {
    const city = req.query.city;
    const data = await getWeatherDetails(city);

    return res.status(200).json({
      success: true,
      message: "Successfully fetched details",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getPrevDetails = async (req, res) => {
  try {
    const city = req.params.city;
    const { start_date, end_date} = req.query;
    const { startTimestamp,endTimestamp }=getTimestamps(start_date,end_date);
    const data = await getTemperatureStatsInDateRange(startTimestamp,endTimestamp,city);
    return res.status(200).json({
      success: true,
      message: "Successfully fetched previous weather details",
      data: data,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};