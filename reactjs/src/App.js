import React, { useEffect, useState } from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Booklist from "./pages/bookList";
import Book from "./pages/book";
import Register from "./pages/register";
import Login from "./pages/login";
import Navigation from "./components/navigation";
import authService from "./services/authService";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    // Check if the user is already logged in by fetching the current account from local storage
    const account = authService.getCurrentAccount();
    if (account) {
      setCurrentAccount(account);
    }
  }, []);

  useEffect(() => {}, [currentAccount]);

  const handleLogout = () => {
    // Handle logout and update the current account state
    authService.logout();
    setCurrentAccount(null);
  };

  const handleLogin = (account) => {
    // Update the current account state with the logged-in user
    setCurrentAccount(account);
  };

  return (
    <div>
      <section>
        <Navigation currentAccount={currentAccount} logout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booklist" element={<Booklist />} />
          <Route
            path="/book/:id"
            element={<Book currentAccount={currentAccount} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
