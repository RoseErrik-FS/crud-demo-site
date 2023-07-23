import axios from "axios";

const API_BASE =
  process.env.NODE_ENV === "development"
    ? `http://localhost:8000/api/v1`
    : process.env.REACT_APP_BASE_URL;

const API_URL = "/auth";

const register = (email, password) => {
  return axios
    .post(`${API_BASE}${API_URL}/`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("account", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const login = (email, password) => {
  return axios
    .post(`${API_BASE}${API_URL}/signin`, {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("account", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("account");
};

const getCurrentAccount = () => {
  return JSON.parse(localStorage.getItem("account"));
};

const authService = {
  register,
  login,
  logout,
  getCurrentAccount,
};

export default authService;
