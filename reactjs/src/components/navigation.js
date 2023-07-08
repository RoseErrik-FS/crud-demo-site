import { Link } from "react-router-dom";

function Navigation() {
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
        <li className="mr-6">
          <Link
            to="/booklist"
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Book List
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
