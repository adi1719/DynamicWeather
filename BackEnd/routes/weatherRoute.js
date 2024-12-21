const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
router.get('/ping',async(req,res)=>{
    return res.status(200).send("pong");
});
router.get('/weather-detail',weatherController.weatherDetails);
router.get('/weather-history/:city',weatherController.getPrevDetails);
module.exports = router;