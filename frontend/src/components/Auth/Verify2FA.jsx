import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(120);
  const [attempts, setAttempts] = useState(0);
  const [resendEnabled, setResendEnabled] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("2fa_email");

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }
    if (timer > 0) {
      const i = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(i);
    }
    setResendEnabled(true);
  }, [timer]);

  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

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
        localStorage.setItem("2fa_verified", email);
        localStorage.removeItem("2fa_email");
        navigate("/dashboard");
      } else {
        setAttempts((a) => a + 1);
        setError(data.error || "Invalid code");
      }
    } catch (err) {
      console.error(err);
      setError("Verification failed. Try again.");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("http://localhost:5050/send-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setTimer(120);
        setResendEnabled(false);
        setAttempts(0);
        setError("");
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

        <h2 className="text-2xl font-bold text-center text-indigo-800 mb-3">
          Two-Factor Authentication
        </h2>

        <p className="text-center text-gray-600 mb-6 text-sm">
          A 6-digit verification code has been sent to <br />
          <span className="font-medium text-indigo-600">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            disabled={attempts >= 3}
            required
            className="p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-center text-lg tracking-widest shadow-sm"
          />

          <button
            type="submit"
            disabled={attempts >= 3}
            className={`py-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg ${
              attempts >= 3
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Verify Code
          </button>
        </form>

        {error && (
          <p className="text-center text-red-500 text-sm mt-3">{error}</p>
        )}

        <div className="mt-5 text-center text-sm text-gray-600">
          <p className="mb-2">
            Time remaining:{" "}
            <span className="font-semibold text-gray-800">{formatTime(timer)}</span>
          </p>

          <button
            onClick={handleResend}
            disabled={!resendEnabled}
            className={`py-3 px-6 rounded-xl font-medium transition-colors duration-200 ${
              resendEnabled
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Resend Code
          </button>

          <p className="mt-3 text-xs text-gray-500">Attempts: {attempts} / 3</p>
        </div>
      </div>
    </div>
  );
}
