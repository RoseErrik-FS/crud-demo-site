// api/services/passport.js
const passport = require("passport");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local");
require("dotenv").config();

const Account = require("../models/account");

const localOptions = {
  usernameField: "email",
};

const localStrategy = new LocalStrategy(localOptions, async function (
  email,
  password,
  done
) {
  try {
    const account = await Account.findOne({ email: email });
    if (!account) {
      return done(null, false);
    }
    const isMatch = await account.comparePassword(password);
    if (!isMatch) {
      return done(null, false);
    }
    return done(null, account);
  } catch (error) {
    return done(error);
  }
});

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
};

const jwtStrategy = new JwtStrategy(jwtOptions, async function (payload, done) {
  try {
    const account = await Account.findById(payload.sub);
    if (account) {
      done(null, account);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

passport.use(localStrategy);
passport.use(jwtStrategy);
