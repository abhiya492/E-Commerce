import axios from "axios";

// Create axios instance with base config
const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5050/api" : "/api",
	withCredentials: true, // send cookies to the server
	timeout: 15000, // 15 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
	(config) => {
		// You could add auth tokens here if needed
		return config;
	},
	(error) => {
		// Handle request errors
		console.error("Request error:", error);
		return Promise.reject(error);
	}
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		// Any status code within the range of 2xx
		return response;
	},
	(error) => {
		// Any status codes outside the range of 2xx
		
		// Handle network errors (e.g., no internet, server down)
		if (!error.response) {
			console.error("Network Error:", error.message);
			// We can customize the error object for consistent handling
			error.customMessage = "Network error - please check your connection";
			return Promise.reject(error);
		}
		
		// Handle specific HTTP status codes with custom messages
		switch (error.response.status) {
			case 401:
				error.customMessage = "Authentication required - please log in";
				// Could trigger a logout or redirect to login here
				break;
			case 403:
				error.customMessage = "You don't have permission to access this resource";
				break;
			case 404:
				error.customMessage = "The requested resource was not found";
				break;
			case 500:
				error.customMessage = "Internal server error - please try again later";
				break;
			default:
				error.customMessage = error.response.data?.message || "An unexpected error occurred";
				break;
		}
		
		// Log errors in development mode
		if (import.meta.env.DEV) {
			console.error(`API Error (${error.response.status}):`, error.response.data);
		}
		
		return Promise.reject(error);
	}
);

export default axiosInstance;