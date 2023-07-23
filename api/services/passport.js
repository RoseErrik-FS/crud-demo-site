// Import required modules
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local");
require("dotenv").config();

// Import the Account model
const Account = require("../models/account");

// Options for LocalStrategy to specify the field for authentication (using email)
const localOptions = {
  usernameField: "email",
};

// LocalStrategy for authenticating users based on email and password
const localStrategy = new LocalStrategy(localOptions, async function (
  email,
  password,
  done
) {
  try {
    // Find the account with the given email
    const account = await Account.findOne({ email: email });

    // If no account is found or the password doesn't match, return false (authentication failed)
    if (!account) {
      return done(null, false);
    }
    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return done(null, false);
    }

    // If authentication is successful, return the account object
    return done(null, account);
  } catch (error) {
    // Return the error if any occurred during authentication
    return done(error);
  }
});

// Options for JwtStrategy to specify the secret key and how to extract the token from the request header
const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
};

// JwtStrategy for authenticating users based on the JWT token
const jwtStrategy = new JwtStrategy(jwtOptions, async function (payload, done) {
  try {
    // Find the account with the ID from the payload
    const account = await Account.findById(payload.sub);

    // If the account is found, return it (authentication succeeded)
    if (account) {
      done(null, account);
    } else {
      // If the account is not found, return false (authentication failed)
      done(null, false);
    }
  } catch (error) {
    // Return the error if any occurred during authentication
    done(error, false);
  }
});

// Use the LocalStrategy and JwtStrategy for passport authentication
passport.use(localStrategy);
passport.use(jwtStrategy);
