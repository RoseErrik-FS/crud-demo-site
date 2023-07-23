// api/controllers/auth_controller.js
const Account = require("../models/account");
const jwt = require("jwt-simple");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;

const tokenForAccount = (account) => {
  const timestamp = new Date().getTime();
  return jwt.encode(
    {
      sub: account._id,
      iat: timestamp,
    },
    jwtSecret
  );
};

exports.signin = (req, res, next) => {
  const account = req.user;
  res.send({ token: tokenForAccount(account), account_id: account._id });
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please Provide Login Credentials" });
  }

  try {
    const existingAccount = await Account.findOne({ email: email });
    const account = new Account({
      email: email,
      password: password,
    });

    const savedAccount = await account.save();
    res.json({
      account_id: savedAccount._id,
      token: tokenForAccount(savedAccount),
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ error: "Failed to create account" });
  }
};
