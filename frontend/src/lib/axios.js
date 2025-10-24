import axios from "axios";

const PROD_API = import.meta.env.VITE_API_URL;
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8000/api"
      : PROD_API || "/api",
  withCredentials: true,
});
