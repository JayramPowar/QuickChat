import { AuthContext } from "./authContext";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// ✅ CREATE AXIOS INSTANCE
const api = axios.create({
  baseURL: backendUrl,
});

// ✅ ADD INTERCEPTOR - THIS IS CRITICAL!
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("⚠️ No token found in localStorage"); // ← ADD THIS LOG
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setsocket] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      const { data } = await api.get("/api/auth/check");

      if (data.success && data.user) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await api.post(`/api/auth/${state}`, credentials);

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        
        setAuthUser(data.userData);
        connectSocket(data.userData);
        
        toast.success(data.message);
        setLoading(false);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    toast.success("Successfully logged out!");
    socket?.disconnect();
  };

  const updateProfile = async (body) => {
    try {
      const { data } = await api.put("/api/auth/update-profile", body);

      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    }
  };

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setsocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });
  };

  useEffect(() => {
    if (token) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  const value = {
    axios: api, // ✅ MUST export 'api', not 'axios'
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


