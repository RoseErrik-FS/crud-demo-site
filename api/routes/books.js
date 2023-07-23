// Importing required modules
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Importing passport configuration and middleware
const passportServices = require("../services/passport");

// Middleware for protecting routes with JWT authentication
const protectedRoute = passport.authenticate("jwt", { session: false });

// Importing the Book model
const Book = require("../models/book");

// Middleware to fetch a book by ID
const getBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.book = book;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all books (Protected Route: Requires JWT token for access)
router.get("/", protectedRoute, async (req, res) => {
  try {
    console.log("Fetching all books...");
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error fetching all books:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET a single book by ID (Protected Route: Requires JWT token for access)
router.get("/:id", protectedRoute, getBook, async (req, res) => {
  console.log("Fetching book by ID...");
  res.json(res.book);
});

// CREATE a new book (Protected Route: Requires JWT token for access)
router.post("/", protectedRoute, async (req, res) => {
  console.log("Creating a new book...");
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
  });
  try {
    const newBook = await book.save();
    console.log("New book created:", newBook);
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating a new book:", error.message);
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a book (Protected Route: Requires JWT token for access)
router.patch("/:id", protectedRoute, getBook, async (req, res) => {
  if (req.body.title != null) {
    res.book.title = req.body.title;
  }
  if (req.body.author != null) {
    res.book.author = req.body.author;
  }
  if (req.body.genre != null) {
    res.book.genre = req.body.genre;
  }
  try {
    const updatedBook = await res.book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a book (Protected Route: Requires JWT token for access)
router.delete("/:id", protectedRoute, getBook, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Exporting the router so that it can be used in other parts of the application
module.exports = router;
