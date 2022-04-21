const User = require("../models/user.model")
const nodemailer = require("nodemailer");
const auth = require("../config/auth.config");

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: auth.user,
        pass: auth.pass
    }
})

const isAdmin = (req, res) => {
    req.email
}
const sendConfirmationEmail = async (req, email, confirmationCode) => {
    await transport.sendMail({
        from: auth.user,
        to: email,
        subject: "Eaglescout Signup Confirmation",
        html: `<h1> Email Confirmation </h1>
        <p> Please follow <a href="${req.protocol}://${req.hostname}/user/signup/${confirmationCode}" target="_blank"
        Link</a> to confirm your email! </p>`
    })
}

module.exports = {
    isAdmin, 
    sendConfirmationEmail,

}