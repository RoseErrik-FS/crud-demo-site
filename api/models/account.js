// api/models/account.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const AccountSchema = new mongoose.Schema({
  email: {
    type: String,
    required: "Email address is required",
    unique: true,
    lowercase: true,
    validate: [validateEmail, "Email Invalid"],
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

AccountSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

AccountSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const Account = mongoose.model("Account", AccountSchema);

module.exports = Account;
