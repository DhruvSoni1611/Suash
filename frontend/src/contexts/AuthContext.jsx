import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}

const DEMO_USERS = [
  {
    email: "customer@demo.com",
    password: "password123",
    user: {
      id: "demo-customer",
      name: "Demo Customer",
      email: "customer@demo.com",
      role: "customer",
    },
    token: "demo-customer-token",
  },
  {
    email: "admin@demo.com",
    password: "password123",
    user: {
      id: "demo-admin",
      name: "Demo Admin",
      email: "admin@demo.com",
      role: "admin",
    },
    token: "demo-admin-token",
  },
  {
    email: "staff@demo.com",
    password: "password123",
    user: {
      id: "demo-staff",
      name: "Demo Staff",
      email: "staff@demo.com",
      role: "staff",
    },
    token: "demo-staff-token",
  },
];

// useEffect(() => {
//   const checkStoredToken = async () => {
//     const storedToken = localStorage.getItem("suash_token");
//     // Check for demo tokens
//     const demo = DEMO_USERS.find((u) => u.token === storedToken);
//     if (demo) {
//       dispatch({
//         type: "LOGIN_SUCCESS",
//         payload: {
//           user: demo.user,
//           token: demo.token,
//         },
//       });
//       dispatch({ type: "SET_LOADING", payload: false });
//       return;
//     }
//     // ...existing API logic...
//     if (storedToken) {
//       try {
//         axios.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${storedToken}`;
//         const response = await axios.get("/api/me");
//         dispatch({
//           type: "LOGIN_SUCCESS",
//           payload: {
//             user: response.data,
//             token: storedToken,
//           },
//         });
//       } catch (error) {
//         localStorage.removeItem("suash_token");
//         delete axios.defaults.headers.common["Authorization"];
//       }
//     }
//     dispatch({ type: "SET_LOADING", payload: false });
//   };

//   checkStoredToken();
// }, []);

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configure axios defaults
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  axios.defaults.baseURL = API_URL;

  // Set token in axios headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
      localStorage.setItem("suash_token", state.token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("suash_token");
    }
  }, [state.token]);

  // Check for stored token on app start
  useEffect(() => {
    const checkStoredToken = async () => {
      const storedToken = localStorage.getItem("suash_token");
      if (storedToken) {
        try {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          const response = await axios.get("/api/me");
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
              user: response.data,
              token: storedToken,
            },
          });
        } catch (error) {
          localStorage.removeItem("suash_token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      dispatch({ type: "SET_LOADING", payload: false });
    };

    checkStoredToken();
  }, []);

  const login = async (email, password) => {
    // Check for demo credentials
    const demo = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (demo) {
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: demo.user,
          token: demo.token,
        },
      });
      toast.success("Demo login successful!");
      return { success: true };
    }

    // If not demo credentials, show error and skip API call
    toast.error("Backend not available. Only demo credentials work.");
    dispatch({ type: "SET_LOADING", payload: false });
    return {
      success: false,
      error: "Backend not available. Only demo credentials work.",
    };
  };

  // const login = async (email, password) => {
  //   try {
  //     dispatch({ type: "SET_LOADING", payload: true });
  //     const response = await axios.post("/api/auth/login", { email, password });

  //     dispatch({
  //       type: "LOGIN_SUCCESS",
  //       payload: {
  //         user: response.data.user,
  //         token: response.data.access_token,
  //       },
  //     });

  //     toast.success("Welcome back!");
  //     return { success: true };
  //   } catch (error) {
  //     const message = error.response?.data?.detail || "Login failed";
  //     toast.error(message);
  //     dispatch({ type: "SET_LOADING", payload: false });
  //     return { success: false, error: message };
  //   }
  // };

  const register = async (userData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await axios.post("/api/auth/register", userData);

      // Auto login after registration
      const loginResult = await login(userData.email, userData.password);
      if (loginResult.success) {
        toast.success("Account created successfully!");
      }

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || "Registration failed";
      toast.error(message);
      dispatch({ type: "SET_LOADING", payload: false });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  const updateUser = (userData) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
