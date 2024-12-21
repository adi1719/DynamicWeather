const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
router.get('/get-alerts',alertController.getAllAlerts);
router.get('/remove-alert/:id',alertController.removeAlert);
router.post('/add-alert',alertController.createAlerts);
module.exports = router;