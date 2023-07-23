// Importing required modules and dependencies
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Function to validate email format using regular expression
const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

// Defining the Account schema using Mongoose
const AccountSchema = new mongoose.Schema({
  // Email field configuration
  email: {
    type: String,
    required: "Email address is required",
    unique: true,
    lowercase: true,
    validate: [validateEmail, "Email Invalid"],
    trim: true,
  },
  // Password field configuration
  password: {
    type: String,
    required: true,
  },
  // createdAt field configuration
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Pre-save middleware to hash the password before saving to the database
AccountSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      // Generating a salt with 10 rounds
      const salt = await bcrypt.genSalt(10);

      // Hashing the password using the generated salt
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      // Handling any error that occurred during password hashing
      next(error);
    }
  } else {
    next();
  }
});

// Method to compare the provided candidate password with the hashed password
AccountSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Using bcrypt's compare method to compare passwords
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Creating the Account model based on the AccountSchema
const Account = mongoose.model("Account", AccountSchema);

// Exporting the Account model
module.exports = Account;
