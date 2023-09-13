const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const LawyerModel = require("../model/lawyer.model");
const generatePassword = require("../utils/generatePassword.js")
const emailTemplate = require('../utils/email-templates.js');
const sendEmail = require('../utils/notificaton.js');
const { otpEmail } = require('../utils/email-templates.js');

 // Import the addLawyer method from admin.controller

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'ace.legal.services.official@gmail.com',
        pass: 'cwzwapjwwwfxkyxy'
    }
});

exports.lawyerLogin = async (req, res) => {
    const { email, password } = req.body;
    const lawyerAvailable = await LawyerModel.findOne({ email });
    const dbPassword = lawyerAvailable?.password;
    const LawyerId = lawyerAvailable?._id;
    if (lawyerAvailable) {
        bcrypt.compare(password, dbPassword, (err, result) => {
            if (err) {
                res.send({ Message: "Password is incorrect" })
            }
            if (result) {
                const token = jwt.sign({ LawyerId }, "ALS");
                res.send({ msg: "login successful", "token": token, status: "success" })
            }
        })
    } else {
        res.send({ msg: "login failed", status: "error" })
    }
}
exports.sendProposal = async (req, res) => {
    try {
      const { jobId, proposal } = req.body;
      const lawyerId = req.user.LawyerId; // Assuming you store lawyer's ID in the JWT
  
      // Check if the job with the given ID exists
      const job = await JobModel.findById(jobId);
      if (!job) {
        return res.status(404).json({ msg: 'Job not found' });
      }
  
      // Create a proposal object
      const newProposal = {
        lawyer: lawyerId,
        proposal: proposal,
      };
  
      // Add the proposal to the job's proposals array
      job.proposals.push(newProposal);
  
      // Save the job with the new proposal
      await job.save();
  
      res.status(201).json({ msg: 'Proposal sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Failed to send proposal' });
    }
  };
  
exports.lawyerSignup = async (req, res) => {
    try {
        const { email, password, name, address, bio, skills, profession, gender, phone, image, price, languages, rating, experience, Rank } = req.body;

        // Check if email is already registered
        const existingLawyer = await LawyerModel.findOne({ email });
        if (existingLawyer) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        // Hash the password
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({ msg: "Internal server error" });
            }

            const newLawyer = new LawyerModel({
                email,
                password: hash,
                name,
                address,
                bio,
                skills,
                profession,
                gender,
                phone,
                image,
                price,
                languages,
                rating,
                experience,
                Rank
            });

            // Save the new lawyer
            await newLawyer.save();

            //! sending account details notification
            const newPass = generatePassword(); // Generate password
            const emailBody = otpEmail(newPass); // Generate the email content using the template

            // Send email notification with the email body and the email address
            await sendEmail(emailBody, email); // Pass both the email body and email address

            res.status(201).json({ msg: "Signup successful", status: "success" });

        });
    } catch (error) {
        res.status(500).json({ msg: "Internal server error" });
    }
}




exports.searchLawyer = async (req, res) => {
    let payload = req.body;
    const myRegexPattern = new RegExp(payload.value);
    let data = await LawyerModel.find({ [payload.type]: { $regex: myRegexPattern, $options: 'i' } })
    res.status(200).json({ data })
}

exports.searchLawyerByEmail = async (req, res) => {
    let email = req.query.email;
    let data = await LawyerModel.find({ email: email })
    res.status(200).json({ data })
}
