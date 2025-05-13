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
const uri = 'mongodb+srv://pmm:ieh2ut6IGQEU8orr@pmm-survey.3ybya.mongodb.net/?retryWrites=true&w=majority&appName=PMM-Survey'
// don't know how long it will take to connect to db, so we use ASYNC to try to connect
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
