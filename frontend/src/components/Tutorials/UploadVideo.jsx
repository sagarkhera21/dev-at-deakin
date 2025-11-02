import React, { useState } from "react";
import { ref, push } from "firebase/database";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

export default function UploadVideo() {
  // State to store selected video file, title input, and loading state
  const [videoFile, setVideoFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Handle video upload to Cloudinary and save metadata in Firebase
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile || !title) return alert("Please select a video and enter a title.");

    setLoading(true);
    try {
      // Prepare form data for Cloudinary
      const formData = new FormData();
      formData.append("file", videoFile);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      // Upload video to Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      // Save video metadata to Firebase Realtime Database
      await push(ref(db, "tutorials"), {
        title,
        videoUrl: data.secure_url,
        uploadedBy: currentUser.email,
        createdAt: Date.now(),
        views: 0,
        ratings: {},
      });

      alert("✅ Video uploaded successfully!");
      setTitle("");
      setVideoFile(null);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed. Try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Upload Tutorial
      </h3>

      {/* Form for title input and video file selection */}
      <form onSubmit={handleUpload} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          required
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
        />

        {/* Upload button with loading state */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2.5 rounded-lg font-semibold text-white transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-4">
        Supported formats: MP4, MOV, AVI, etc.
      </p>
    </div>
  );
}
