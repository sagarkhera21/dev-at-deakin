
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import UploadVideo from "../components/Tutorials/UploadVideo";
import VideoCard from "../components/Tutorials/VideoCard";
import { useNavigate } from "react-router-dom";

export default function Tutorials() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!currentUser) navigate("/login");
    const tutorialRef = ref(db, "tutorials");
    onValue(tutorialRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val).map(([id, data]) => ({ id, ...data }));
      setVideos(arr.reverse());
    });
  }, [currentUser]);

  // Filter videos by search
  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            🎓 Tutorials
          </h2>


          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        

        {/* Upload Section */}
        <div className="mb-10">
          <UploadVideo />
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-8">
          <input
            type="text"
            placeholder="🔍 Search tutorials..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Video Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <h3 className="text-lg text-gray-600">
              No tutorials found. Try uploading or searching again.
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
