import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Booklist() {
  // State variables
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    title: "",
    author: "",
    genre: "",
  });

  // API base URL
  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_BASE_URL;

  // Fetch books from the API
  const getBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  // Call getBooks when the component mounts
  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getBooks();
    }

    return () => {
      ignore = true;
    };
  }, [getBooks]);

  // Create a new book
  const createBook = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      getBooks();
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
