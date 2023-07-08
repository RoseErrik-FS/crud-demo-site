import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../App.css";

function Book() {
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

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? `http://localhost:8000/api/v1`
      : process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      getBook();
    }

    return () => {
      ignore = true;
    };
  }, []);

  const getBook = async () => {
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
  };

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
      setBook(data); // Update the book state with the updated data
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateBook();
  };

  const handleInputChanges = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold mb-4">Book Profile</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={deleteBook}
        >
          Delete Book
        </button>
        {book && (
          <div className="mt-4">
            <h5 className="text-xl font-bold">{book.title}</h5>
            <p className="text-gray-500">Author: {book.author}</p>
            <p className="text-gray-500">Genre: {book.genre}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex flex-col mb-4">
            <label className="font-bold">Title:</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleInputChanges}
              className="border border-gray-400 rounded p-2 text-black"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="font-bold">Author:</label>
            <input
              type="text"
              name="author"
              value={values.author}
              onChange={handleInputChanges}
              className="border border-gray-400 rounded p-2 text-black"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="font-bold">Genre:</label>
            <input
              type="text"
              name="genre"
              value={values.genre}
              onChange={handleInputChanges}
              className="border border-gray-400 rounded p-2 text-black"
            />
          </div>
          <input
            type="submit"
            value="Submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          />
        </form>
      </header>
    </div>
  );
}

export default Book;
