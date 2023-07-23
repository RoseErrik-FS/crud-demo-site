import React from "react";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client"; // Import createRoot from "react-dom/client"
import reportWebVitals from "./reportWebVitals";

const root = createRoot(document.getElementById("root")); // Use createRoot from "react-dom/client"
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

reportWebVitals();
