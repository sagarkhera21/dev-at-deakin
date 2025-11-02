import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  // Store input values for user registration
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handles user registration with Firebase Authentication
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create a new user with email and password
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Update user profile to include full name
      await updateProfile(userCred.user, {
        displayName: `${firstName} ${lastName}`,
      });

      alert("Registration successful! Please login.");
      navigate("/login"); // Redirect to login after successful signup
    } catch (err) {
      alert(err.message); // Show any Firebase error messages
    }
  };

  // Registration form with styled input fields and buttons
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 mx-4 relative overflow-hidden">
        {/* Decorative Circles for background design */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-200 rounded-full opacity-30"></div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-8">
          Create Your Account
        </h2>

        {/* Registration form inputs */}
        <form onSubmit={handleRegister} className="flex flex-col gap-5">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-1/2 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-1/2 p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm placeholder-gray-400"
          />

          {/* Submit button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-lg text-lg"
          >
            Register
          </button>
        </form>

        {/* Navigation link for existing users */}
        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
