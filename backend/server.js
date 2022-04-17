const express = require('express');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json())


mongoose.connect('mongodb://localhost/eaglescout');
var db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB database connection established successfully")
})

const login = require('./routes/login');
const scout = require('./routes/scout');
const admin = require('./routes/admin');
const account = require('./routes/account');

  

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);  
});