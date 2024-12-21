const { saveOrUpdate, getAlertList } = require("../db/queries");

const axios = require("axios");
require("dotenv").config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.USER_EMAIL, 
        pass: process.env.USER_PASS
    }
});

const sendAlertEmail = async(userEmail, currentTemp, thresholdTemperature) => {

    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: userEmail,
        subject: 'Temperature Alert',
        text: `Alert! The current temperature is ${currentTemp}°C, which is above the threshold of ${thresholdTemperature}°C.`
    };
    
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Alert email sent: ' + info.response);
    });
};
const sendAlert = async ( temperature,city) => {
  try {
    const data=await getAlertList(temperature,city);
    
    if(!data.length)return;
    for(const it of data){
      if(temperature>it.thresold){
        await sendAlertEmail(it.email,temperature,it.thresold);
      }
    }    
  } catch (err) {
    throw err;
  }
};

const apiCallWeatherDetails = async (city) => {
    
  try{const apiKey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const { data } = await axios.get(url);
  return data;}
  catch(err){
    console.log(err.message);
    return null;
    
  }
};

const weatherScheduler = async () => {
  try {
    const cities = [
      "Kolkata",
      "Delhi",
      "Mumbai",
      "Chennai",
      "Bangalore",
      "Hyderabad",
    ];

    for (let i=0;i<6;i++) {
      const city=cities[i];
      const data = await apiCallWeatherDetails(city);
      await sendAlert(data.main.temp,data.name);
      const value = await saveOrUpdate({
        description: data.weather[0].description,
        temp: data.main.temp,
        timestamp: data.dt,
        type: data.weather[0].main,
        name: data.name,
      });
    }
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = weatherScheduler;