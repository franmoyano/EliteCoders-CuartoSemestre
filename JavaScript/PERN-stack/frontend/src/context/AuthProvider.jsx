import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "../api/axios.js";
import { AuthContext } from "./authContext.js";
import parseErrors from "../utils/parseError";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);

  const signin = async (data) => {
    try {
      const response = await axios.post("/signin", data);
      setUser(response.data);
      setIsAuth(true);
      return response.data;
    } catch (error) {
      
      const errs = parseErrors(error);
      console.log(errs);
      setErrors(errs);
    }
  };

  const signup = async (data) => {
    try {
      const response = await axios.post("/signup", data);
      setUser(response.data);
      setIsAuth(true);
      return response.data;
    } catch (error) {
      const errs = parseErrors(error);
      console.log(errs);
      setErrors(errs);
    }
  };

  const signout = async () => {
    try {
      const res = await axios.post("/signout");
      setUser(null);
      setIsAuth(false);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (Cookie.get("token")) {
      axios
        .get("/profile")
        .then((res) => {
          setUser(res.data);
          setIsAuth(true);
        })
        .catch(() => {
          setUser(null);
          setIsAuth(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (errors) {
      const timeout = setTimeout(() => setErrors(null), 4500);
      return () => clearTimeout(timeout);
    }
  }, [errors]);

  return (
    <AuthContext.Provider
      value={{ user, isAuth, errors, signup, setUser, signin, signout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
