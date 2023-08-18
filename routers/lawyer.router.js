const express = require('express');
const authorization = require('../middlewares/authorization.middleware');
const LawyerRouter = express.Router();
const lawyerController = require('../controllers/lawyer.controller');
const appointmentController = require('../controllers/appointment.controller.js')

LawyerRouter.post("/login", lawyerController.lawyerLogin);
LawyerRouter.post("/signup", lawyerController.lawyerSignup); // Add this line

LawyerRouter.post('/searchLawyer', lawyerController.searchLawyer)
LawyerRouter.get('/searchLawyerByEmail', lawyerController.searchLawyerByEmail)

LawyerRouter.get("/deleteAppointment", appointmentController.deleteAppointment);

module.exports = LawyerRouter;
