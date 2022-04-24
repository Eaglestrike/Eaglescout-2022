const express = require('express');
const cors = require('cors');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
mongoose.connect('mongodb://localhost/eaglescout');
var db = mongoose.connection;
db.once('open', () => {
    console.log("MongoDB database connection established successfully")
})
app.use(cors());
app.use(express.json());
app.use(bodyParser.json())



const scout = require('./routes/scout');
const admin = require('./routes/admin');
const user = require('./routes/user');

app.use('/api/scout', scout);
app.use('/api/admin', admin);
app.use('/api/user', user)

app.listen(port, () => {
    console.log(`server is running on port: ${port}`);  
});