import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

   const res = await fetch("https://dev-at-deakin.onrender.com/send-2fa", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});


      const data = await res.json();
      if (!data.success) throw new Error("Failed to send 2FA code");

      localStorage.setItem("2fa_email", email);
      navigate("/verify-2fa");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed");
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      const userEmail = auth.currentUser?.email;
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
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mx-4 relative overflow-hidden">
       
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-200 rounded-full opacity-30"></div>

        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign in to continue to <span className="font-medium text-indigo-600">Dev@Deakin</span>
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-4 w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
          />

          <button
            type="submit"
            className="bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-shadow duration-200 shadow-lg text-lg"
          >
            Sign In
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="grow border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <hr className="grow border-gray-300" />
        </div>

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
