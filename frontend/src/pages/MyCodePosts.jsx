import React, { useEffect, useState } from "react";
import { ref, onValue, remove } from "firebase/database";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MyCodePosts() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snap) => {
      const val = snap.val() || {};
      const arr = Object.entries(val)
        .map(([id, post]) => ({ id, ...post }))
        .filter((p) => p.author === currentUser.email);
      setPosts(arr);
    });
  }, [currentUser]);

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    remove(ref(db, `posts/${id}`))
      .then(() => {
        alert("Post deleted successfully!");
      })
      .catch((err) => {
        alert("Error deleting post: " + err.message);
      });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">📂 My Code Posts</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            ⬅ Back to Dashboard
          </button>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-600">No code posts yet. Try adding some in the Code Editor!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition flex flex-col"
              >
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">🧠 Code Snippet</h3>
                <div className="border-t pt-2 text-gray-700 prose max-h-40 overflow-y-auto flex-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content.slice(0, 200) + (post.content.length > 200 ? "..." : "")}
                  </ReactMarkdown>
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Posted by <b>{post.author}</b>
                </p>

                {/* Delete button at bottom */}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="mt-3 bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition text-sm self-start"
                >
                   Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
