// api/routes/auth.js
const express = require("express");
const passport = require("passport");
const passportServices = require("../services/passport");

const requireLogin = passport.authenticate("local", { session: false });
const router = express.Router();

const AuthController = require("../controllers/auth_controller");

router.post("/", AuthController.signup);
router.post("/signin", requireLogin, AuthController.signin);

module.exports = router;
