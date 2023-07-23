import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import bookServices from "../services/bookService";
import authService from "../services/authService";
import authHeader from "../services/authHeader";

function Booklist() {
  // State variables
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    title: "",
    author: "",
    genre: "",
  });

  const navigate = useNavigate();

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_BASE_URL;

  // Function to fetch books from the API
  const fetchBooks = async () => {
    try {
      console.log("Fetching all books...");
      const response = await bookServices.getAllBooks();
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Secure Page Error:", error.response);
      if (error.response && error.response.status === 403) {
        authService.logout();
        navigate("/login");
      }
      setError(error.message || "Unexpected Error");
      setLoading(false);
    }
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Create a new book
  const createBook = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: {
          ...authHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      fetchBooks(); // Refresh the books list after creating a new book
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    createBook();
  };

  // Handle input changes
  const handleInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render book list and create book form
  return (
    <div className="container">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 pr-0 lg:pr-4">
          <h1 className="text-3xl font-bold mb-4">Book List</h1>
          <ul>
            {books.map((book) => (
              <li key={book._id}>
                <Link
                  to={`/book/${book._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  {book.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full lg:w-1/2 pl-0 lg:pl-4">
          <h1 className="text-3xl font-bold mb-4">Create New Book</h1>
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-4">
              <label className="block font-bold">Title:</label>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full text-black bg-white"
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold">Author:</label>
              <input
                type="text"
                name="author"
                value={values.author}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full text-black bg-white"
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold">Genre:</label>
              <input
                type="text"
                name="genre"
                value={values.genre}
                onChange={handleInputChange}
                className="border border-gray-300 px-4 py-2 rounded-md w-full text-black bg-white"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
            >
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booklist;
