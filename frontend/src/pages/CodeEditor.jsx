import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { ref, push, serverTimestamp } from "firebase/database";
import { useNavigate } from "react-router-dom";

export default function CodeEditor() {
  const [value, setValue] = useState("");
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!currentUser) return alert("You need to be logged in!");
    if (!value.trim()) return alert("Post cannot be empty!");

    setLoading(true);
    try {
      const postsRef = ref(db, "posts");
      await push(postsRef, {
        content: value,
        author: currentUser.email,
        createdAt: serverTimestamp()
      });
      alert("Post submitted successfully!");
      setValue("");
    } catch (err) {
      alert("Error saving code: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-100 py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with title and dashboard button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            💻 Code Editor
          </h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {/* Code Editor and Markdown Preview */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <CodeMirror
              value={value}
              extensions={[markdown()]}
              onChange={setValue}
              height="400px"
              placeholder="Write your markdown/code here..."
            />
          </div>
          <div className="flex-1 p-4 border rounded-md h-[400px] overflow-auto bg-white">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          {loading ? "Submitting..." : "Submit Code"}
        </button>
      </div>
    </div>
  );
}
