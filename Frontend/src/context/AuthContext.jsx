import React, { useEffect, useState, useContext } from "react";
import api from "../config/Api";
import { useToast } from "./ToastContext";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const { showToast } = useToast();
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("HealthUP_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isLogin = !!user;
  const role = user?.role || "";
  const [hasProfile, setHasProfile] = useState(() => {
    const storedProfile = sessionStorage.getItem("HealthUP_hasProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("HealthUP_user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("HealthUP_user");
    }
  }, [user]);

  useEffect(() => {
    if (hasProfile !== null) {
      sessionStorage.setItem("HealthUP_hasProfile", JSON.stringify(hasProfile));
    }
  }, [hasProfile]);

  //log-in context
  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const authData = response.data.data;

    sessionStorage.setItem("HealthUP_token", authData.token);
    sessionStorage.setItem("HealthUP_user", JSON.stringify(authData.user));
    setUser(authData.user);
    setHasProfile(authData.hasProfile);

    return response;
  };

  //register context
  const register = async (name, email, password) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    const authData = response.data.data;

    sessionStorage.setItem("HealthUP_token", authData.token);
    sessionStorage.setItem("HealthUP_user", JSON.stringify(authData.user));
    setUser(authData.user);
    setHasProfile(false);

    return response;
  };

  //logout context
  const logout = async () => {
    try {
      const res = await api.post("/auth/logout");
      showToast(res.data.message);
    } catch (error) {
      showToast(error?.response?.data?.message || "Unable to Logout", "error");
    } finally {
      setUser(null);
      setHasProfile(null);

      sessionStorage.removeItem("HealthUP_user");
      sessionStorage.removeItem("HealthUP_token");
      sessionStorage.removeItem("HealthUP_hasProfile");
    }
  };

  const value = {
    user,
    setUser,
    isLogin,
    role,
    hasProfile,
    setHasProfile,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
