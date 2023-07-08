import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home";
import Booklist from "./pages/bookList";
import Book from "./pages/book";
import Navigation from "./components/navigation";

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/Booklist" exact element={<Booklist />} />
        <Route path="/Book/:id" exact element={<Book />} />
      </Routes>
    </Router>
  );
}

export default App;
