const dotenv = require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;
const homeRoute = require('./routes/home');
const apiRoute = require('./routes/api');
const userRoute = require('./routes/User');
const cors = require('cors');

// ===================== MIDDLEWARE =============================

// allows JSON PAYLOADS to be PARSED
app.use(express.urlencoded({extended: true}));
app.use(express.json())

// allows clients to access api routes
app.use(cors({
    origin: "*",
    credentials: true,
}));
// ===============================================================


//  ==================== CONNECT 2 DATABASE =======================

// link to access mongodb database
const username = encodeURIComponent(dotenv.parsed.MONGO_USERNAME);
const password = encodeURIComponent(dotenv.parsed.MONGO_PASSWORD);
const uri = `mongodb+srv://${username}:${password}@utc-survey.biotw3c.mongodb.net/?retryWrites=true&w=majority&appName=UTC-Survey`;
async function connect2Mongo(){
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect2Mongo();

// ====================================================================


// ====================== USE MAIN ROUTES =================================
app.use("/", homeRoute);
app.use("/api", apiRoute);
app.use("/user", userRoute);

// ====================================================================

// run server
app.listen(port, () => console.log(`Your server is running ON ${port}... `))
