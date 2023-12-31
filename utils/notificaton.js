const nodemailer = require("nodemailer");


//! ============> NodeMailer utils

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'ace.legal.services.official@gmail.com',
        pass: 'cwzwapjwwwfxkyxy'
    }
});

//! ===============> Send confirmation emails

const sendEmail = async (htmlBody, toEmail) => {
        const mailOptions = {
            from: "ace.legal.services.official@gmail.com",
            to: toEmail,
            subject: "Verify your email",
            html: htmlBody, // html body
        };
        await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;