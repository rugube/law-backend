const express = require('express');
const AppointmentModel = require('../model/appointment.model');
const AppoinmtentRouter = express.Router();

AppoinmtentRouter.get('/fetch/userEmail', async (req, res) => {
  let email = req.query.email;
  try {
    console.log('Fetch Appointments Request for User:', email);

    let data = await AppointmentModel.find({ userEmail: email });
    res.send({ data });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ msg: error.message });
  }
});

AppoinmtentRouter.get('/fetch/lawyerEmail', async (req, res) => {
  let email = req.query.email;
  try {
    console.log('Fetch Appointments Request for Lawyer:', email);

    let data = await AppointmentModel.find({ lawyerEmail: email });
    res.send({ data });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ msg: error.message });
  }
});

AppoinmtentRouter.get('/count/userEmail', async (req, res) => {
  try {
    const userEmail = req.query.email;
    console.log('Count Appointments Request for User:', userEmail);

    const count = await AppointmentModel.countDocuments({ userEmail });
    console.log('Meeting Count:', count);

    res.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching appointments count:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = AppoinmtentRouter;
