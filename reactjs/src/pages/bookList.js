import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    title: "",
    author: "",
    genre: "",
  });

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getBooks();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getBooks = async () => {
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
  };

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
      getBooks(); // Fetch the updated list of books
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createBook();
  };

  const handleInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold mb-4">Book List</h1>
        <ul>
          {books.map((book) => (
            <li key={book._id}>
              <Link to={`/book/${book._id}`}>{book.title}</Link>
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <label className="block font-bold">Title:</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold">Author:</label>
            <input
              type="text"
              name="author"
              value={values.author}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold">Genre:</label>
            <input
              type="text"
              name="genre"
              value={values.genre}
              onChange={handleInputChange}
              className="border border-gray-300 px-4 py-2 rounded-md w-full text-black"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
      </header>
    </div>
  );
}

export default Dashboard;
