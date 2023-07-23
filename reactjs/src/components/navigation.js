import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Navigation({ currentAccount, logout }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // useEffect to check if the user is logged in when the component mounts
  useEffect(() => {
    // Check if the currentAccount prop has a value (i.e., the user is logged in)
    setIsLoggedIn(currentAccount !== null);
  }, [currentAccount]);

  // Function to handle user logout
  const handleLogout = () => {
    authService.logout(); // Call the logout function from authService to clear the user's token from local storage
    logout(); // Call the logout function passed as a prop to update the currentAccount state in the parent component
    navigate("/login"); // Navigate to the login page after successful logout
  };

  // Render the navigation menu
  return (
    <nav className="bg-gray-800 py-4">
      <ul className="flex justify-center">
        <li className="mr-6">
          <Link
            to="/"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Home
          </Link>
        </li>
        {isLoggedIn ? ( // If user is logged in, show Book List and Logout
          <>
            <li className="mr-6">
              <Link
                to="/booklist"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Book List
              </Link>
            </li>
            <li>
              <button
                className="text-white hover:text-gray-300 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          // If user is not logged in, show Create Account and Login
          <>
            <li className="mr-4">
              <Link
                to="/register"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Create Account
              </Link>
            </li>
            <li className="mr-4">
              <Link
                to="/login"
                className="text-white hover:text-gray-300 transition duration-300"
              >
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;
