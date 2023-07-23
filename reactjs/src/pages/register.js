import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await authService.register(email, password).then(
        (response) => {
          navigate("/");
        },
        (error) => {
          console.error(error);
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-4">Create an Account</h1>
      <form onSubmit={handleRegister} className="mt-4">
        <div className="flex flex-col mb-4">
          <label className="font-bold text-white">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-400 rounded p-2 text-black bg-white"
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="font-bold text-white">Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-400 rounded p-2 text-black bg-white"
            required
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
