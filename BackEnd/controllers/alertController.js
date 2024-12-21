const { getAllAlerts, createAlert, removeAlert } = require("../db/queries");

exports.createAlerts = async (req, res) => {
  try {
    const { email, thresoldTemperature, city } = req.body;
    const result = await createAlert(thresoldTemperature, email, city);
    const data=await getAllAlerts();
    return res.status(200).json({
      success: true,
      message: "Your Alert is Successfully created",
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

exports.removeAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await removeAlert(id);
    const data=await getAllAlerts();

    return res.status(200).json({
      success: true,
      message: "your alert is Removed Successfully",
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

exports.getAllAlerts = async (req, res) => {
  try {
    const data = await getAllAlerts();

    return res.status(200).json({
      success: true,
      message: "List of All Alerts",
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