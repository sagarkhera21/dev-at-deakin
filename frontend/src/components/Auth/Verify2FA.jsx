import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify2FA() {
  // State variables for 2FA code input, timer, attempts, resend status, and error messages
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(120);
  const [attempts, setAttempts] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("2fa_email"); // Get email from local storage

  // Timer logic and redirect if no email found
  useEffect(() => {
    if (!email) {
      navigate("/login"); // Redirect to login if email is missing
      return;
    }
    if (timer > 0) {
      const i = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(i); // Clear interval on unmount or timer change
    }
    setResendEnabled(true); // Enable resend button when timer reaches 0
  }, [timer]);

  // Format seconds into MM:SS
  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // Handle verification of entered 2FA code
  const handleVerify = async (e) => {
    e.preventDefault();
    if (attempts >= 3) {
      setError("Too many attempts. Please resend the code.");
      return;
    }
    try {
      const res = await fetch("https://dev-at-deakin.onrender.com/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("2fa_verified", email); // Mark 2FA as verified
        localStorage.removeItem("2fa_email"); // Clean up email from local storage
        navigate("/dashboard"); // Redirect to dashboard on success
      } else {
        setAttempts((a) => a + 1); // Increment attempt counter
        setError(data.error || "Invalid code");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Try again.");
    }
  };

  // Handle resending a new 2FA code
  const handleResend = async () => {
    try {
      const res = await fetch("https://dev-at-deakin.onrender.com/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        setTimer(120); // Reset timer
        setResendEnabled(false); // Disable resend until timer ends
        setAttempts(0); // Reset attempts
        setError(""); // Clear errors
        alert("New 2FA code sent to your email.");
      } else {
        setError("Failed to resend code.");
      }
    } catch (err) {
      console.error(err);
      setError("Resend failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-200 p-10 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-200 rounded-full opacity-30"></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-purple-200 rounded-full opacity-30"></div>

        {/* Page heading */}
        <h2 className="text-2xl font-bold text-center text-indigo-800 mb-3">
          Two-Factor Authentication
        </h2>

        {/* Email information */}
        <p className="text-center text-gray-600 mb-6 text-sm">
          A 6-digit verification code has been sent to <br />
          <span className="font-medium text-indigo-600">{email}</span>
        </p>

        {/* 2FA code input form */}
        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            disabled={attempts >= 3} // Disable input after 3 failed attempts
            required
            className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-center text-lg tracking-widest shadow-sm"
          />

          {/* Verify button */}
          <button
            type="submit"
            disabled={attempts >= 3} // Disable after 3 attempts
            className={`py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
              attempts >= 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Verify Code
          </button>
        </form>

        {/* Display errors */}
        {error && (
          <p className="text-center text-red-500 text-sm mt-3">{error}</p>
        )}

        {/* Timer and resend section */}
        <div className="mt-5 text-center text-sm text-gray-600">
          <p className="mb-2">
            Time remaining:{" "}
            <span className="font-semibold text-gray-800">{formatTime(timer)}</span>
          </p>

          {/* Resend button */}
          <button
            onClick={handleResend}
            disabled={!resendEnabled} // Only enable when timer ends
            className={`py-3 px-6 rounded-xl font-medium transition-colors duration-200 ${
              resendEnabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Resend Code
          </button>

          {/* Show number of attempts */}
          <p className="mt-3 text-xs text-gray-500">Attempts: {attempts} / 3</p>
        </div>
      </div>
    </div>
  );
}
