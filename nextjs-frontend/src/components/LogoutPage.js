"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/authSlice";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
      } catch (error) {
        console.error("Logout failed:", error.message);
      }
      dispatch(logout());
      router.push("/", { replace: true });
    };

    handleLogout();
  }, []);

  return <p>Redirecting</p>;
};

export default LogoutPage;
