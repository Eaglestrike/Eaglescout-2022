const User = require("../models/user.model")
const nodemailer = require("nodemailer");
const auth = require("../config/auth.json");
const secrets = require("../config/secrets.json");
const jwt = require("jsonwebtoken")

//REMEMBER TO SET req.headers.x-access-token

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: auth.user,
        pass: auth.pass
    }
})

const sendConfirmationEmail = async (req, email, confirmationCode) => {
    await transport.sendMail({
        from: auth.user,
        to: email,
        subject: "Eaglescout Signup Confirmation",
        html: `<h1> Email Confirmation </h1>
        <p> Please follow <a href="${req.protocol}://${req.hostname}/user/confirmation/${confirmationCode}" target="_blank"
        Link</a> to confirm your email! </p>`
    })
}

const sendResetPasswordEmail = async(req,email,token) => {
    await transport.sendMail({
        from: auth.user,
        to: email,
        subject: "Eaglescout Reset Password Confirmation",
        html: `<h1> Reset Password </h1>
        <p> Please follow <a href="${req.protocol}://${req.hostname}/user/forgotpassword/${token}" target="_blank"
        Link</a> to reset your password! </p>`
    })
}

const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];
    console.log(token)
    if(token) {
        try {
            var decoded = jwt.verify(token, secrets.JWT_KEY)
            req.user=decoded;
            next() 
        }
        catch(err) {
            res.status(400).json({error: "User is not logged in"});
        } 
    }
    else{
        res.status(400).json({error: "Token does not exist"})
    }
}

const ensureUser = (req,res,next) => {
    if(req.user.role == 'admin' || req.user.role == 'user') next();
    res.status(403).send({error: "Insufficient Permissions"})
}

const ensureAdmin = (req,res,next) => {
    if(req.user.role == 'admin') next();
    res.status(403).send({error: "Insufficient Permissions"})
}

const getUserInfo = (user) => {
    return {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        status: user.status
    }
}

module.exports = {
    sendConfirmationEmail,
    verifyJWT,
    ensureAdmin,
    ensureUser,
    getUserInfo,
}