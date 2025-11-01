import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import Logout from "../components/Auth/Logout";
import WeatherCard from "../components/WeatherCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tutorials, setTutorials] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [codePosts, setCodePosts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    // Tutorials
    const tutorialsRef = ref(db, "tutorials");
    onValue(tutorialsRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val)
        .map(([id, t]) => ({ id, ...t }))
        .filter((t) => t.uploadedBy === currentUser.email);
      setTutorials(arr);

      const uploads = arr.map((t) => ({
        type: "upload",
        text: `You uploaded "${t.title}"`,
        createdAt: t.createdAt,
      }));
      setRecentActivity((prev) => [...uploads, ...prev]);
    });

    // Chat Rooms
    const roomsRef = ref(db, "rooms");
    onValue(roomsRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val)
        .map(([id, r]) => ({ id, ...r }))
        .filter(
          (r) =>
            r.ownerUid === currentUser.uid ||
            (r.members && r.members[currentUser.uid])
        );
      setChatRooms(arr);

      const chatActivity = arr.map((r) => ({
        type: "chat",
        text: `You joined chat room "${r.title}"`,
        createdAt: r.createdAt,
      }));
      setRecentActivity((prev) => [...chatActivity, ...prev]);
    });

    // Code Posts
    const codeRef = ref(db, "posts");
    onValue(codeRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val)
        .map(([id, c]) => ({ id, ...c }))
        .filter((c) => c.author === currentUser.email);
      setCodePosts(arr);

      const codeActivity = arr.map((c) => ({
        type: "code",
        text: `You submitted a code post`,
        createdAt: c.createdAt,
      }));
      setRecentActivity((prev) => [...codeActivity, ...prev]);
    });
  }, [currentUser]);

  const sortedActivity = recentActivity.sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col p-6">
        {/* Logo */}
        <h1
          className="text-3xl font-extrabold text-indigo-600 mb-10 text-center cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          DEV@Deakin
        </h1>

        {/* User Info */}
        <div className="text-center mb-10">
          <p className="text-gray-600 text-base">Welcome back,</p>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            {currentUser?.displayName || currentUser?.email}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-3 text-gray-700 font-medium">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 transition text-lg"
            onClick={() => navigate("/tutorials")}
          >
            🎥 <span>Tutorials</span>
          </button>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 transition text-lg"
            onClick={() => navigate("/chat")}
          >
            💬 <span>Chat Rooms</span>
          </button>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 transition text-lg"
            onClick={() => navigate("/code-editor")}
          >
            📝 <span>Code Editor</span>
          </button>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-indigo-50 transition text-lg"
            onClick={() => navigate("/my-codes")}
          >
            📂 <span>My Code Posts</span>
          </button>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-8">
          <Logout className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold text-lg" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Banner with Weather */}
        <div className="bg-linear-to-r from-indigo-100 to-purple-100 rounded-3xl p-8 mb-8 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 relative">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-indigo-800 mb-3">
              Welcome back, {currentUser?.displayName || "User"}!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Here's your personalized dashboard showing your recent activity and
              contributions.
            </p>
          </div>
          <div className="shrink-0">
            <WeatherCard side={false} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div
            className="bg-indigo-500 text-white rounded-2xl p-8 w-64 text-center shadow-md cursor-pointer hover:scale-105 transition"
            onClick={() => navigate("/tutorials")}
          >
            <p className="text-4xl font-bold">{tutorials.length}</p>
            <p className="mt-3 text-lg">Tutorials Uploaded</p>
          </div>

          <div
            className="bg-purple-500 text-white rounded-2xl p-8 w-64 text-center shadow-md cursor-pointer hover:scale-105 transition"
            onClick={() => navigate("/chat")}
          >
            <p className="text-4xl font-bold">{chatRooms.length}</p>
            <p className="mt-3 text-lg">Chat Rooms Joined</p>
          </div>

          <div
            className="bg-green-500 text-white rounded-2xl p-8 w-64 text-center shadow-md cursor-pointer hover:scale-105 transition"
            onClick={() => navigate("/code-editor")}
          >
            <p className="text-4xl font-bold">{codePosts.length}</p>
            <p className="mt-3 text-lg">Code Posts</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Recent Activity
            </h3>
            <button
              className="text-sm text-red-600 hover:text-red-800 font-medium transition"
              onClick={() => setRecentActivity([])}
            >
              Clear All
            </button>
          </div>

          {sortedActivity.length === 0 ? (
            <p className="text-gray-500 text-base">No recent activity.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sortedActivity.map((a, i) => (
                <li key={i} className="py-2 flex items-center gap-2 text-gray-700 text-base">
                  {a.type === "upload" && <span>🎥</span>}
                  {a.type === "chat" && <span>💬</span>}
                  {a.type === "code" && <span>📝</span>}
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
