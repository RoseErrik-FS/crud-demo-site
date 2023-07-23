// Importing required modules and dependencies
const Account = require("../models/account");
const jwt = require("jwt-simple");
require("dotenv").config();

// Fetching the JWT secret key from the environment variables
const jwtSecret = process.env.JWT_SECRET;

// Function to generate a JWT token for the account
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

// Controller function to handle account signin
exports.signin = (req, res, next) => {
  const account = req.user;
  // Sending the token and account ID in the response
  res.send({ token: tokenForAccount(account), account_id: account._id });
  console.log("Received signin request with credentials:", req.body);
};

// Controller function to handle account signup
exports.signup = async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if both email and password are provided
  if (!email || !password) {
    return res.status(422).json({ error: "Please Provide Login Credentials" });
  }

  try {
    // Checking if an account with the provided email already exists
    const existingAccount = await Account.findOne({ email: email });

    // If an account with the email exists, return an error
    if (existingAccount) {
      return res.status(422).json({ error: "Email is already in use" });
    }

    // Creating a new account with the provided email and password
    const account = new Account({
      email: email,
      password: password,
    });

    // Saving the account to the database
    const savedAccount = await account.save();

    // Sending the account ID and token in the response
    res.json({
      account_id: savedAccount._id,
      token: tokenForAccount(savedAccount),
    });
  } catch (error) {
    // Handling any errors that occurred during the signup process
    console.error("Error in signup:", error);
    return res.status(500).json({ error: "Failed to create account" });
  }
};
