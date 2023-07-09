import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

function Book() {
  // State variables
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    title: "",
    author: "",
    genre: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  // API base URL
  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_BASE_URL;

  // Fetch book data from the API
  const getBook = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/books/${id}`);
      const data = await response.json();
      setBook(data);
      setValues({
        title: data.title,
        author: data.author,
        genre: data.genre,
      });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  }, [id, API_BASE]);

  // Call getBook when the component mounts
  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getBook();
    }

    return () => {
      ignore = true;
    };
  }, [getBook]);

  // Delete book from the API
  const deleteBook = async () => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/books/${id}`, {
        method: "DELETE",
      });
      navigate("/booklist", { replace: true });
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  // Update book data in the API
  const updateBook = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      setBook(data);
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    updateBook();
  };

  // Handle input changes
  const handleInputChanges = (event) => {
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

  // Render book profile and update form
  return (
    <div className="container flex justify-center items-center h-screen">
      <div className="w-full lg:w-1/2">
        {/* Book Profile */}
        <h1 className="text-3xl font-bold mb-4">Book Profile</h1>
        {book && (
          <div className="mt-4">
            <p className="text-white mb-2">Title: {book.title}</p>
            <p className="text-white">Author: {book.author}</p>
            <p className="text-white">Genre: {book.genre}</p>
          </div>
        )}
        {/* Update Book Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col mb-4">
            <label className="font-bold text-white">Title:</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleInputChanges}
              className="border border-gray-400 rounded p-2 text-black bg-white"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="font-bold text-white">Author:</label>
            <input
              type="text"
              name="author"
              value={values.author}
              onChange={handleInputChanges}
              className="border border-gray-400 rounded p-2 text-black bg-white"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="font-bold text-white">Genre:</label>
            <input
              type="text"
              name="genre"
              value={values.genre}
              onChange={handleInputChanges}
              className="border border-gray-400 rounded p-2 text-black bg-white"
            />
          </div>
          <div className="flex justify-between">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={deleteBook}
            >
              Delete Book
            </button>
            <input
              type="submit"
              value="Submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Book;
