import axios from "axios";

const axiosClient = axios.create({
  baseURL: `http://localhost:4000/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ ADD this line
});

// ✅ REMOVE all token handling
axiosClient.interceptors.request.use((config) => {
  return config; // No token manipulation needed
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    try {
      const { response } = error;
      if (response.status === 401) {
        localStorage.setItem(
          "TOKEN_EXPIRE",
          "Your login has expired. Please log in again to continue."
        );
        window.location.href = '/login';
      }
    } catch (error) {
      console.error(error);
    }
    throw error;
  }
);

export default axiosClient;