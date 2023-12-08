import axios from "axios";
import store from "../store";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://virtualrealitycreators.com/supportsnap-backend/api/v1" + "/"
    : "http://localhost:8000/api" + "/";

let API = axios.create({ baseURL });

// Add a request interceptor
API.interceptors.request.use(
  function (config) {
    let token = localStorage.getItem("token");
    if (!token) delete config.headers["Authorization"];
    else config.headers["Authorization"] = `Bearer ${token}`;

    // Do something before request is sent(this is for loader display)
    store.state.isLoading = true;
    return config;
  },
  function (error) {
    // Do something with request error
    store.state.isLoading = false;
    return Promise.reject(error);
  }
);

// Add a response interceptor

// Any status code that lie within the range of 2xx cause this function to trigger
// Do something with response data

API.interceptors.response.use(
  function (response) {
    store.state.isLoading = false;
    return response;
  },
  function (error) {
    store.state.isLoading = false;
    return Promise.reject(error);
  }
);

export default API;
