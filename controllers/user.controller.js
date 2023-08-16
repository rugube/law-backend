const UserModel = require("../model/user.model");
const UserOTP = require("../model/UserOTPVerification");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/notificaton");
const emailTemplate = require('../utils/email-templates.js');
exports.fetchAllUsers = async (req, res) => {
    try {
        const Users = await UserModel.find();
        res.send(Users)
    } catch (error) {
        res.send(error)
    }
}
exports.createUser = async (req, res) => {
    const { name, gender, phone, email, password } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.json({ Message: "You have already signed up, please login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            gender,
            email,
            phone,
            password: hashedPassword,
            verified: false
        });

        await newUser.save();
        sendOTPVerificationEmail(newUser, res);

        return res.json({ exist: false, success: true, Message: "Sign up successful" });
    } catch (error) {
        console.log(error);
        return res.json({ exist: false, success: false, Message: "Sign up failed", error });
    }
};

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    const userAvailable = await UserModel.findOne({ email });
    const userid = userAvailable?._id;
    const username = userAvailable?.name;
    const hashpassword = userAvailable?.password;

    if (userAvailable) {
        bcrypt.compare(password, hashpassword, (err, result) => {

            if (err) {
                res.send({ Message: "Password is incorrect" })
            }

            if (result) {
                const token = jwt.sign({ id: userid }, "ALS");
                res.send({
                    msg: "login successful", "token": token, status: "success",
                    name: username, userData: userAvailable
                })
            } else {
                res.send({ msg: "login failed", status: "error" })
            }
        })
    }
    else {
        res.send({ Message: "please signup", status: "error" })
    }
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'ace.legal.services.official@gmail.com',
        pass: 'cwzwapjwwwfxkyxy'
    }
});

const sendOTPVerificationEmail = async ({ _id, email }, res) => {
    try {
        const otp = `${1000 + Math.floor(Math.random() * 1000)}`;
        const mailOptions = {
            from: "ace.legal.services.official@gmail.com",
            to: email,
            subject: "Verify your email",
            html: emailTemplate.otpEmail(otp), // html body
        };
        const saltRounds = 10;
        let hashedOTP = await bcrypt.hash(otp, saltRounds);
        let newOTPVerification = await new UserOTP({
            _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expireAt: Date.now() + 3600000
        })
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
    } catch (error) {
        res.send(error)
    }
}


exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        if (!userId || !otp) {
            return res.json({ msg: "userId and otp are required" });
        }

        const userRecord = await UserOTP.findOne({ userId });

        if (!userRecord) {
            return res.json({ msg: "Account record doesn't exist or has already been verified" });
        }

        const isValidOTP = await bcrypt.compare(otp, userRecord.otp);

        if (!isValidOTP) {
            return res.json({ msg: "OTP is incorrect" });
        }

        const payload = { verified: true };
        await UserModel.findByIdAndUpdate(userId, payload);
        await UserOTP.deleteMany({ userId });
        sendEmail(emailTemplate.signupSuccess());

        return res.json({
            status: 'VERIFIED',
            msg: "Email Successfully Verified"
        });
    } catch (error) {
        return res.json({
            status: 'FAILED',
            error: error.message
        });
    }
};


exports.forgotPassword = async (req, res) => {
    console.log(req.boyd)
    let { email } = req.body;
    let user = await UserModel.find({ email });
    console.log(user)
    let userName = user[0].name;
    let url = "https://joyful-kheer-dd1d3b.netlify.app/"

    try {
        const mailOptions = {
            from: "ace.legal.services.official@gmail.com",
            to: email,
            subject: "Reset Password",
            html: emailTemplate.resetPassword(userName, url)// html body
        };

        await transporter.sendMail(mailOptions);

        res.json({
            msg: "Password change link is sended",
            Status: "Success",
            data: {
                userId: user[0]._id
            }
        })
    } catch (error) {
        res.json(error)
    }
}
exports.getaUserDataByEmail = async (req, res) => {
    let email = req.query.email;
    try {

        let userData = await UserModel.findOne({ email });
        if (userData) {
            res.send({ msg: "User Found", userData })
        } else {
            res.send({ msg: "Not Found UserData for this Email" })
        }
    } catch (error) {
        res.send({ msg: "Some error" })
    }
}
exports.getUserByID = async (req, res) => {
    let id = req.params.id;
    try {
        let user = await UserModel.findOne({ _id: id });
        res.json({ Message: "User Data By Google Auth", user })
    } catch (error) {
        res.send({ Message: "Some error in Backend" })
    }
}

