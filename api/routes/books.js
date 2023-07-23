// api/routes/book.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

const passportServices = require("../services/passport");

const protectedRoute = passport.authenticate("jwt", { session: false });

const Book = require("../models/book");

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

// GET all books
router.get("/", protectedRoute, async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single book
router.get("/:id", protectedRoute, getBook, async (req, res) => {
  res.json(res.book);
});

// CREATE a new book
router.post("/", protectedRoute, async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    genre: req.body.genre,
  });
  try {
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a book
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

// DELETE a book
router.delete("/:id", protectedRoute, getBook, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
