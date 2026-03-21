import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import ResetPassword from "./components/auth/ResetPassword";
import Homepage from "./pages/Homepage";
// import Login from "./pages/Login";
// import Register from "./pages/Register";

import "./App.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setError, setUser } from "./redux/slices/authSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearError, logout, setLoading } from "./redux/slices/authSlice";

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const storedToken = token || localStorage.getItem("token");
    if (!storedToken || user) return;

    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(clearError());
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );

        console.log("Fetched user:", res.data);

        dispatch(setUser({ user: res.data, token: storedToken }));
      } catch (error) {
        console.error("getMe failed:", error);
        dispatch(logout());
        dispatch(
          setError(
            error?.response?.data?.message ||
              "Session expired. Please log in again.",
          ),
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch, token, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Homepage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
