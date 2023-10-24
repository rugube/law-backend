const express = require('express');
const AppointmentModel = require('../model/appointment.model');
const authorization = require('../middlewares/authorization.middleware');
const AppoinmtentRouter = express.Router(); // Keeping the variable name

// Fetch appointments by user email
AppoinmtentRouter.get('/fetch/userEmail:email', async (req, res) => {
  const email = req.query.email;
  try {
    const data = await AppointmentModel.find({ userEmail: email });
    res.send({ data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Fetch appointments by lawyer email
AppoinmtentRouter.get('/fetch/lawyerEmail:email', async (req, res) => {
  const email = req.query.email;
  try {
    const data = await AppointmentModel.find({ lawyerEmail: email });
    res.send({ data });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Fetch latest appointments
AppoinmtentRouter.get('/latest', async (req, res) => {
  try {
    const latestAppointments = await AppointmentModel.find()
      .sort({ appointment_date: -1 }) // Sort in descending order by appointment date
      .limit(3); // Limit the results to the latest 3 appointments
    res.send({ latestAppointments });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = AppoinmtentRouter; // Keeping the export name
