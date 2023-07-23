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

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("Received signup request for email:", email);
  console.log("Received signup request for password:", password);

  if (!email || !password) {
    return res.status(422).json({ error: "Please Provide Login Credentials" });
  }

  try {
    const existingAccount = await Account.findOne({ email: email });
    console.log("After finding existing account:", existingAccount);

    console.log("Before saving account to the database");
    const account = new Account({
      email: email,
      password: password,
    });

    const savedAccount = await account.save();
    console.log("Account saved to the database:", savedAccount);
    res.json({
      account_id: savedAccount._id,
      token: tokenForAccount(savedAccount),
    });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ error: "Failed to create account" });
  }
};
