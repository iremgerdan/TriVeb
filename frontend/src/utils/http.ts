import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000",
});

http.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access-token");

  config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : "";

  return config;
});

export default http;
