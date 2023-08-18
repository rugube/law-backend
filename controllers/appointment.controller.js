const AppointmentModel = require("../model/appointment.model");
const UserModel = require("../model/user.model");
const sendEmail = require("../utils/notificaton");
const emailTemplate = require('../utils/email-templates.js');
const LawyerModel = require("../model/lawyer.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'Ace.Legal.Services.official@gmail.com',
        pass: 'cwzwapjwwwfxkyxy'
    }
});

exports.addAppointment = async (req, res) => {
    let payload = req.body;
    const user = await UserModel.find({ email: payload.userEmail });
    const lawyer = await LawyerModel.find({ email: payload.lawyerEmail });

    if (user.length === 0 || lawyer.length === 0) {
        return res.status(400).json({ msg: "User or lawyer not found", success: false });
    }

    const userName = user[0].name || "Unknown User";
    const lawyerName = lawyer[0].name || "Unknown Lawyer";

    const mailOptions = {
        from: "ace.legal.services.official@gmail.com",
        to: [payload.userEmail, payload.lawyerEmail],
        subject: "Appointment Status",
        html: emailTemplate.appointmentSuccess(userName, lawyerName, payload.appointment_date?.date, payload?.appointmentTime, payload?.meeting_type)
    };

    try {
        let newAppointment = new AppointmentModel(payload);
        await newAppointment.save();
        await transporter.sendMail(mailOptions);
        res.status(201).json({ msg: "Appointment Created", success: true });
    } catch (error) {
        res.status(500).json({ msg: error.message, success: false });
    }
}

exports.deleteAppointment = async (req, res) => {
    let id = req.body.DeleteId;

    try {
        await AppointmentModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Appointment has been removed', success: true });
    } catch (error) {
        res.status(500).json({ error: error.message, success: false });
    }
}
