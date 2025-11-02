import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Logout({ className }) {
  const navigate = useNavigate();

  // Function to handle user logout
  const handleLogout = async () => {
    await signOut(auth); // Firebase method to sign out the current user
    localStorage.removeItem("2fa_verified"); // Clear stored 2FA session data
    localStorage.removeItem("2fa_email");
    navigate("/login"); // Redirect to login page after logout
  };

  // Logout button component with customizable styles
  return (
    <button
      onClick={handleLogout}
      className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition ${className || ""}`}
    >
      Logout
    </button>
  );
}
