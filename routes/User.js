const express = require("express");
const router = express.Router();
const controller = require('../controllers/userController');


//Main Routes - simplified for now
router.get("/", controller.get);
router.post("/", controller.post);



module.exports = router;