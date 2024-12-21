const express = require('express')
const weatherRoute=require('./routes/weatherRoute')
const cors = require('cors')
const bodyParser = require('body-parser');
const app= express();
const db = require('./db/config');
const weatherScheduler = require('./utils/jobScheduler');
const alertRoute = require("./routes/alertRoute");
require("dotenv").config();
const PORT = process.env.PORT||8080;
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
setInterval(weatherScheduler,600000);
app.use('/',alertRoute);
app.use('/',weatherRoute);
app.listen(PORT,'0.0.0.0',()=>{
    console.log(`Listening to ${PORT}`);
});