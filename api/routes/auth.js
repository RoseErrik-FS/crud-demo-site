// Importing required modules
const express = require("express");
const passport = require("passport");
const passportServices = require("../services/passport");

// Middleware for authenticating user login
const requireLogin = passport.authenticate("local", { session: false });

// Creating an instance of the Express Router
const router = express.Router();

// Importing the AuthController which contains the authentication logic
const AuthController = require("../controllers/auth_controller");

// POST request for user signup
// When a POST request is made to this endpoint ("/"), it will call the signup method from the AuthController
router.post("/", AuthController.signup);

// POST request for user signin
// The requireLogin middleware is used to authenticate the user before allowing access to the signin endpoint
// When a POST request is made to this endpoint ("/signin"), it will first go through the requireLogin middleware and then call the signin method from the AuthController
router.post("/signin", requireLogin, AuthController.signin);

// Exporting the router so that it can be used in other parts of the application
module.exports = router;
