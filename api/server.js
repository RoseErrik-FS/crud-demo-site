const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to the database
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error("Database connection error:", error));
db.once("open", () => console.log("Database connection established"));

app.use(express.json());

// Import routers
const bookRouter = require("./routes/books");
const authRouter = require("./routes/auth");

// Route middleware
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/auth", authRouter);

// Serve React static files
app.use(express.static(path.join(__dirname, "../reactjs/build")));

// Handle all other routes for React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../reactjs/build", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
