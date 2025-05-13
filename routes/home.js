const express = require("express");
const router = express.Router();
const controller = require('../controllers/homeController');


//Main Routes - simplified for now
//router.get("/", homeController.getIndex);

router.get("/", controller.get);
router.get("/home", controller.get2);



module.exports = router;