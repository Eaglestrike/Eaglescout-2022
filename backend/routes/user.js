const express = require("express")
const User = require("../models/user.model")
const router = express.Router();
const bcrypt = require("bcrypt");
const utils = require("../utils/utils");
const loginUtil = require("../utils/login");
const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets")


const createDefaultAdmin = async () =>{
    var user = await User.find();
    if(user.length > 0) return;
    var pass = await bcrypt.hash("team114",10);
    var user = {
        email: "admin@team114.org",
        password: pass,
        name: {
            first: "ad",
            last: "min"
        },
        role: "owner",
        status: "active",
        confirmationCode: "123123123123123",
    }
    var admin = new User(user);
    await admin.save();
}

createDefaultAdmin();


router.route("/login")
.post(async (req, res) => {
    var user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({error: "User does not exist"});
    var valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) return res.status(400).send({error: "Passwords do not match"});
    var token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        secrets.JWT_KEY,
        {expiresIn: 10000000}
    );
    res.status(200).send({msg: "Success", user: loginUtil.getUserInfo(user),authToken: token})
})

router.route("/signup")
.post(async (req,res) => {
    const body = req.body;
    if (!(body.email && body.password)) {
        return res.status(400).send({ error: "Data not formatted properly" });
    }
    var foundUser = await User.findOne({email: body.email});
    if(foundUser != null) {
        return res.status(400).send({error: "An account with this email already exists!"});
    }
    try {    
        var confirmation = utils.genConfirmationCode(25);
        var user = {
            ...body,
            name: {
                first: "",
                last: "",
            },
            role: "viewer",
            status: "pending",
            confirmationCode: confirmation,
        }
        user.password = await bcrypt.hash(user.password, 10);
        var newUser = new User(user);
        newUser.save();
        await loginUtil.sendConfirmationEmail(req,user.email,confirmation);
        res.status(200).send({msg: "Successfully sent confirmation email"})
    } 
    catch(err) {
        res.status(400).send({error: err});
    }
})

router.route("/signup/email")
.post(async (req,res) => {
    var user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send({error: "User does not exist"});
    await loginUtil.sendConfirmationEmail(req,user.email,user.confirmationCode);
    res.status(200).send({msg: "Successfully sent confirmation email"})
})

router.route("/signup/code/:code")
.put(async (req,res) => {
    var code = req.params.code
    curUser = await User.findOne({confirmationCode: code})
    if(curUser.status =="active"){
        return res.status(400).send({error: "User is already authenticated"});
    }
    if(curUser == null){
        return res.status(400).send({ error: `Could not find user with confirmation code ${code}`})
    }
    curUser.status = "active";
    await curUser.save();
    var token = await loginUtil.issueAuthToken(curUser.email);
    res.status(200).send({"msg": "Success! Your email has been authenticated", authToken: token})
})



router.route("/profile")
.get(loginUtil.verifyJWT, async (req,res) => {
    var user = await User.findOne({email: req.user.email});
    
    var userProfile = loginUtil.getUserInfo(user);
    res.send({msg: "Success", user: userProfile});
})
.post(loginUtil.verifyJWT, async (req, res) => {
    const body = req.body;
    var user = await User.findOne({email: req.user.email});
    if(!user){
        return res.status(400).send({ error: "User does not exist!" });
    }
    if(!(req.body.firstName && req.body.lastName)){
        return res.status(400).send({error: "firstName and "})
    }
    if(req.body.firstName){
        user.name.first = req.body.firstName;
    }
    if(req.body.lastName){
        user.name.last = req.body.lastName;
    }
    await user.save();

    res.status(200).send({msg: "Successfully updated user profile", });
})

router.route("/resetpassword")
.post(loginUtil.verifyJWT, async (req, res) => {
    const body = req.body;
    if (!(req.user.email && body.password)) return res.status(400).send({ error: "Data not formatted properly" });
    var user = await User.findOne({email: req.user.email});
    if(!user) return res.status(400).send({ error: "User does not exist!" });
    var valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid) return res.status(400).send({error: "Passwords do not match"})
    user.password = await bcrypt.hash(body.newPassword,10)
    await user.save();
    res.status(200).send({msg: "Successfully reset password"});
})

router.route("/forgotpassword/token")
.post(async (req,res) => {
    var body = req.body;
    var email = body.email;
    var user = await User.findOne({email: email});
    if(!user) return res.status(400).send({error: "Could not find user"});
    var token = jwt.sign({id: user._id},secrets.JWT_KEY,{expiresIn: 450});
    await loginUtil.sendResetPasswordEmail(req, email, token);
    res.status(200).send({msg: "Successfully sent email"});
})

router.route("/forgotpassword/valid/:token")
.get(async (req,res) => {
    console.log(req.params)
    try {
        var decoded = jwt.verify(req.params.token,secrets.JWT_KEY);
        var user = await User.findById(decoded.id);
        if(!user) return res.status(400).send({error: "Invalid token"});
        return res.status(200).send({msg: "Valid token", email: user.email});
    }
    catch(err){
        return res.status(400).send({error: "Invalid token"});
    }
})

router.route("/forgotpassword/reset")
.put(async (req,res) => {
    var body = req.body;
    var token = req.params.token;
    var decoded;
    try{
        decoded = jwt.verify(token,secrets.JWT_KEY);
    }
    catch(err) {
        return res.status(400).send({error: "Invalid token"});
    }
    try {
        var user = await User.findById(decoded.id);
        if(!user) return res.status(400).send({error: "Could not find user"}); 
        user.password = await bcrypt.hash(body.password,10);
        await user.save();
        return res.status(200).send({msg: "Successfully reset password"});
    }
    catch(err) {
        return res.status(400).send({error: "could not save user"})
    }
})

router.route("/list")
.get([loginUtil.verifyJWT, loginUtil.ensureAdmin], async (req,res) => {
    var list = await User.find();
    return res.status(200).send({msg: "Success", list: list});
})

router.route("/id/:id")
.get(loginUtil.verifyJWT, async (req,res) => {
    var user = await User.findById(req.params.id);
    if(!user) return res.status(400).send({error: "User does not exist"});
    if(!(req.user.role == 'admin' || req.user.role == 'moderator' || req.user.id == user._id)) 
        return res.status(400).send({error: "Insufficient Permissions"});
    return res.status(200).send({msg: "Success", user: user});
})
.delete([loginUtil.verifyJWT, loginUtil.ensureAdmin], async (req,res) => {
    var uesr = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(400).send({error: "User does not exist"});
    return res.status(200).send({msg: "Successfully deleted user"});
})

router.route("/role/:id")
.put([loginUtil.verifyJWT,loginUtil.ensureModerator], async (req,res) => {
    var body = req.body;
    var user = await User.findById(req.params.id);
    var userRoles = User.schema.paths.role.enumValues;
    if(!user) return res.status(400).send({error: "User does not exist"});
    if(userRoles.indexOf(body.newRole) < userRoles.indexOf(req.user.role))
        return res.status(400).send({error: "Insufficient Permissions"});
    if(userRoles.indexOf(user.role) < userRoles.indexOf(req.user.role))
    user.role = body.newRole;
    await user.save();
    res.status(200).send({msg: "Success!"});
})

module.exports = router;