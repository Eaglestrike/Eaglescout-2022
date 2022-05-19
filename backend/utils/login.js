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
        <p> Please follow 
        <a href="${req.protocol}://${req.hostname}:3000/signup/code?code=${confirmationCode}" target="_blank">
        Link</a> to confirm your email! </p>`
    })
    return;
}

const sendResetPasswordEmail = async(req,email,token) => {
    await transport.sendMail({
        from: auth.user,
        to: email,
        subject: "Eaglescout Reset Password",
        html: `<h1> Reset Password </h1>
        <p> Please follow 
        <a href="${req.protocol}://${req.hostname}:3000/forgotpassword/token?token=${token}" target="_blank">
        Link</a> to reset your password! </p>`
    })
    return;
}

const verifyJWT = async (req, res, next) => {
    const token = req.header("authorization").split(' ')[1];
    if(token) {
        try {
            var decoded = jwt.verify(token, secrets.JWT_KEY)
            if(decoded.status == "pending") return res.status(400).send({error: "User account has not been activated"});
            var user = await User.findById(decoded.id);
            req.user=getUserInfo(user);
            next() 
        }
        catch(err) {
            res.status(400).json({error: "User is not logged in"});
        } 
    }
    else{
        res.status(400).json({error: "User is not logged in"})
    }
}

const ensureUser = (req,res,next) => {
    if(req.user.role == 'admin' || req.user.role == 'user' || req.user.role == 'moderator') return next();
    return res.status(403).send({error: "Insufficient Permissions"})
}

const ensureModerator = (req, res, next) => {
    if(req.user.role == 'admin' || req.user.role == 'moderator') return next();
    return res.status(403).send({error: "Insufficient Permissions"})
}

const ensureAdmin = (req,res,next) => {
    if(req.user.role == 'admin') return next();
    return res.status(403).send({error: "Insufficient Permissions"})
}

const issueAuthToken = async (email) => {
    var user = await User.findOne({email: email});
    var userinfo = {
        id: user._id,
        email: user.email,
    };
    return jwt.sign(userinfo, secrets.JWT_KEY, {expiresIn: 24000});   
}

const getUserInfo = (user) => {
    return {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        status: user.status,
    }
}

module.exports = {
    sendConfirmationEmail,
    sendResetPasswordEmail,
    verifyJWT,
    ensureAdmin,
    ensureModerator,
    ensureUser,
    getUserInfo,
    issueAuthToken,
}