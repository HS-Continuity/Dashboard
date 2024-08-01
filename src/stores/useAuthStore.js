import { create } from "zustand";
import axios from "axios";
import base64 from "base-64";

const useAuthStore = create((set, get) => ({
  accessToken: null,
  username: null,
  isAuthenticated: false,
  isInitializing: true,
  initializeAttempts: 0,
  maxInitializeAttempts: 3,

  initializeAuth: async () => {
    const { initializeAttempts, maxInitializeAttempts } = get();
    if (initializeAttempts >= maxInitializeAttempts) {
      console.error("Max initialization attempts reached");
      set({ isInitializing: false });
      return false;
    }

    set({ initializeAttempts: initializeAttempts + 1 });

    try {
      const response = await axios.get(
        "http://localhost:8010/memberservice/access-token",
        { timeout: 5000 },
        { withCredentials: true }
      );

      const authHeader = response.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const payload = JSON.parse(base64.decode(token.split(".")[1]));
        const username = payload.username;

        set({
          accessToken: token,
          username: username,
          isAuthenticated: true,
          isInitializing: false,
          initializeAttempts: 0,
        });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return true;
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      if (error.code === "ECONNREFUSED") {
        console.log("Server is not responding. Retrying in 5 seconds...");
        setTimeout(() => get().initializeAuth(), 5000);
      } else {
        set({
          accessToken: null,
          username: null,
          isAuthenticated: false,
          isInitializing: false,
        });
        delete axios.defaults.headers.common["Authorization"];
      }
    }
    return false;
  },

  login: async loginData => {
    try {
      const response = await axios.post(
        "http://localhost:8010/memberservice/api/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 5000,
        }
      );

      const authHeader = response.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7);
        const payload = JSON.parse(base64.decode(token.split(".")[1]));
        const username = payload.username;

        set({ accessToken: token, username: username, isAuthenticated: true });
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return true;
      } else {
        console.error("No valid Authorization header found");
        return false;
      }
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post(
        "http://localhost:8010/memberservice/api/auth/logout",
        {},
        {
          withCredentials: true,
          timeout: 5000,
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    }
    set({ accessToken: null, username: null, isAuthenticated: false });
    delete axios.defaults.headers.common["Authorization"];
  },

  setupInterceptors: () => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const isRefreshed = await get().initializeAuth();
            if (isRefreshed) {
              originalRequest.headers["Authorization"] = `Bearer ${get().accessToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  },
}));

export default useAuthStore;
