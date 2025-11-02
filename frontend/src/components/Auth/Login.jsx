import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  // State variables for storing user input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle email-password login
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    try {
      // Firebase built-in method to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Send a request to backend server to trigger 2FA code to user's email
      const res = await fetch("https://dev-at-deakin.onrender.com/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      // Parse JSON response from backend
      const data = await res.json();
      if (!data.success) throw new Error("Failed to send 2FA code");

      // Store user email locally for 2FA verification page
      localStorage.setItem("2fa_email", email);
      navigate("/verify-2fa"); // Redirect to 2FA verification page
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed");
    }
  };

  // Handle Google sign-in using Firebase popup method
  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const userEmail = auth.currentUser?.email;

      // After Google login, trigger 2FA through backend
      if (userEmail) {
        await fetch("https://dev-at-deakin.onrender.com/send-2fa", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        });

        localStorage.setItem("2fa_email", userEmail);
        navigate("/verify-2fa");
      } else {
        alert("Google login succeeded but no email found.");
      }
    } catch (err) {
      console.error("Google login:", err);
      alert(err.message || "Google login failed");
    }
  };

  return (
    // Main container with background gradient
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mx-4 relative overflow-hidden">
        
        {/* Decorative background circles */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-200 rounded-full opacity-30"></div>

        {/* Page header */}
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign in to continue to <span className="font-medium text-indigo-600">Dev@Deakin</span>
        </p>

        {/* Login form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
            className="p-4 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
            className="p-4 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
          />

          {/* Email sign-in button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-shadow duration-200 shadow-lg text-lg"
          >
            Sign In
          </button>
        </form>

        {/* Divider between sign-in methods */}
        <div className="flex items-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* Google login button */}
        <button
          onClick={handleGoogle}
          className="w-full py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Register link */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:underline transition-all"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
