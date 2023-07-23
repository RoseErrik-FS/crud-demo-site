// Importing required module
const mongoose = require("mongoose");

// Defining the book schema using Mongoose
const bookSchema = new mongoose.Schema({
  // Title field configuration
  title: {
    type: String,
    required: true, // The title is required for a book
  },
  // Author field configuration
  author: {
    type: String,
    required: true, // The author is required for a book
  },
  // Genre field configuration
  genre: {
    type: String,
    required: true, // The genre is required for a book
  },
  // createdAt field configuration
  createdAt: {
    type: Date,
    required: true,
    default: Date.now, // The createdAt field will automatically be set to the current date and time when the book is created
  },
});

// Creating the Book model based on the bookSchema
module.exports = mongoose.model("Book", bookSchema);
