// api/routes/auth.js
const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth_controller");

router.post("/", AuthController.signup);

module.exports = router;
