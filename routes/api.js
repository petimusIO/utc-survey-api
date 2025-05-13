const express = require("express");
const router = express.Router();
const controller = require('../controllers/apiController');

router.get("/", controller.get);
router.get("/data", controller.getQuestions);

// make a new survey
router.post("/create", controller.createSurvey);


module.exports = router;