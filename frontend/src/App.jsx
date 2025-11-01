

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import Verify2FA from "./components/Auth/Verify2FA";
import Dashboard from "./pages/Dashboard";
import Tutorials from "./pages/Tutorials";
import ChatPage from "./pages/ChatPage";
import Home from "./pages/Home";
import CodeEditor from "./pages/CodeEditor";
import MyCodePosts from "./pages/MyCodePosts"; 

// Protected route wrapper
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const verified = localStorage.getItem("2fa_verified");
  if (!currentUser || !verified) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Default home */}
          <Route path="/" element={<Home />} />

          {/* Auth routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-2fa" element={<Verify2FA />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tutorials"
            element={
              <ProtectedRoute>
                <Tutorials />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="/my-codes" element={<MyCodePosts />} />
          
          <Route
            path="/code-editor"
            element={
              <ProtectedRoute>
                <CodeEditor />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
