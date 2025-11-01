import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Logout({ className }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("2fa_verified");
    localStorage.removeItem("2fa_email");
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition ${className || ""}`}
    >
      Logout
    </button>
  );
}
