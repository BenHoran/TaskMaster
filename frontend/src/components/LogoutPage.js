import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "./store";
import axios from "axios";
import { useEffect } from "react";

const LogoutPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await axios.post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          }
        );

        dispatch(logout());
      } catch (error) {
        console.error("Login failed:", error.message);
      }
    };

    handleLogout();
  }, [user, dispatch]);

  return <Navigate to={"/"} />;
};

export default LogoutPage;
