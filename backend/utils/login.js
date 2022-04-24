const User = require("../models/user.model")
const nodemailer = require("nodemailer");
const auth = require("../config/auth.json");
var secrets = require("../config/secrets.json");
var jwt = require("jsonwebtoken")


const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: auth.user,
        pass: auth.pass
    }
})

const isAdmin = (req, res) => {
    
}
const sendConfirmationEmail = async (req, email, confirmationCode) => {
    await transport.sendMail({
        from: auth.user,
        to: email,
        subject: "Eaglescout Signup Confirmation",
        html: `<h1> Email Confirmation </h1>
        <p> Please follow <a href="${req.protocol}://${req.hostname}/api/user/signup/${confirmationCode}" target="_blank"
        Link</a> to confirm your email! </p>`
    })
}

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if(token) {
        jwt.verify(token, secrets.jwt, (err, decoded) => {
            if(err) return res.status(400).json({error: "User is not logged in"});
            req.user=decoded;
            next() 
        })
    }
    else{
        res.status(400).json({error: "Token does not exist"})
    }
}

module.exports = {
    isAdmin, 
    sendConfirmationEmail,
    verifyJWT,
}